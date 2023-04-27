var variables = {};
var labels    = {};

var varsToCreate = [];

var initVarPos = 0;
var pos        = 0;

const functions = {};
const conso     = {};
const ram       = {};
const accum     = {};

// Machine Cycle 

var myCache = null;
var fetchedData = []
var decodedData = []
var canFetch    = true;
var executePos  = null;
var usingPipeline = false;
var usingCache  = false;


// KEYWORD => OPCODE
const generators = 
{
    HLT: () => "000",
    INP: () => "901",
    OUT: () => "902",

    BRA: (label) => "6" + labels[label],
    BRP: (label) => "8" + labels[label],
    BRZ: (label) => "7" + labels[label],

    ADD: (value) => "1" + (value in variables ? variables[value] : value),
    SUB: (value) => "2" + (value in variables ? variables[value] : value),
    STA: (value) => "3" + (value in variables ? variables[value] : value),
    LDA: (value) => "5" + (value in variables ? variables[value] : value)
}

// BRA
functions["6"] = async function(newPos) {
    conso.log("Jumping to postion " + newPos)
    pos = newPos;
    canFetch = true;
};

// BRP
functions["8"] = async function(newPos) {
    if (accum.get() > 0) {
        conso.log("Jumping to postion " + newPos)
        pos = newPos;
        canFetch = true;
        return;
    }
    conso.log("Ignoring BRP");
    pos++;
    canFetch = true;
};

// BRZ
functions["7"] = async function(newPos) {
    if (accum.get() == 0) {
        conso.log("Jumping to postion " + newPos)
        pos = newPos;
        canFetch = true;
        return;
    }
    conso.log("Ignoring BRZ");
    pos++;
    canFetch = true;
};

// INP & OUT
functions["9"] = async function(value) {
    if(value == "01")
    {
        conso.log("Getting input");
        let input = prompt('Input: ');
        accum.set(input)
        document.getElementById("input").value += input + "\n";
    }
    else
    {
        conso.log("Outputing accumulator value");
        document.getElementById("output").value += accum.get() + "\n";
    }
    //pos++;
}

// HLT
functions["0"] = async function() {
    conso.log("Ending program");
    pos = -1;
}

// ADD
functions["1"] = async function(p) {
    let value = ram.get(p);
    conso.log("Adding " + value + " to accumulator");
    accum.set(parseInt(accum.get()) + parseInt(value));
    //pos++;
}

// SUB
functions["2"] = async function(p) {
    let value = ram.get(p);
    conso.log("Subtracting " + value + " from accumulator");
    accum.set(parseInt(accum.get()) - parseInt(value));
    //pos++;
}

// STA
functions["3"] = async function(p) {
    let value = accum.get();
    conso.log("Storing at " + p + " value: " + value)
    ram.add(p, value);
    //pos++;
}

// LDA
functions["5"] = async function(p) {
    conso.log("Loading from " + p + " to accumulator");
    accum.set(ram.get(p));
    //pos++;
}

// ------------------------------------------------ //

function tuc(str, index) 
{ 
    const indiceInvertido = str.length - index;
    const primeiraParte = str.slice(0, indiceInvertido);
    const segundaParte = str.slice(indiceInvertido);
  
    return [primeiraParte, segundaParte];
}

function lowCounter(lista) 
{  
    let indiceMenor = 0;
    let menorValor = lista[0].counter;

    for (let i = 1; i < lista.length; i++) {
        if (lista[i].counter < menorValor) {
        menorValor = lista[i].counter;
        indiceMenor = i;
        }
    }

    return indiceMenor;
}

class CacheMemory {
    constructor(num_linhas)
    {
        this.num_linhas = num_linhas;
        this.cache = [];
    }

    initCache()
    {
        for(let i = 0; i < this.num_linhas; i++)
        {
            this.cache.push({"validade": 0, "tag": 'null', "dado": 'null'});
        }
        this.updateCacheVisual();
    }

    async updateCacheVisual()
    {
        for(let i = 0; i < this.num_linhas; i++)
        {
            let tRow = document.getElementById('r_' + i);
            let tTag = document.getElementById('t_' + i);
            let tValid = document.getElementById('v_' + i);
            let tData = document.getElementById('d_' + i);
            tTag.value = this.cache[i].tag;
            tValid.value = this.cache[i].validade;
            tData.value = this.cache[i].dado; 
            let newPos = parseInt((this.cache[i].tag + this.cache[i].dado), 2);
            let slot = document.getElementById('h_' + newPos);
            slot.style.backgroundColor = "#7b4657";
            tRow.style.backgroundColor = "#7b4657";
            await sleep(50);
            tRow.style.backgroundColor = "transparent";
            slot.style.backgroundColor = "transparent";
        }
    }

    accessCache(address)
    {
        let [tag, dado] = tuc(address, this.num_linhas/2);
        for(let i = 0; i < this.cache.length; i++)
        {
            if (this.cache[i]["validade"] == 1 && this.cache[i]['tag'] == tag && this.cache[i]['dado'] == dado)
            {
                CacheMemory.log("CACHE HIT at ADDRESS: " + tag + dado);
                return 'hit';
            }
        }
        CacheMemory.log("CACHE MISS at ADDRESS: " + tag + dado);
        this.storeCache(address);
        return 'miss';
    }

    storeCache(address)
    {
        let mypos = parseInt(address, 2);
        for(let i = 0; i < this.num_linhas; i++)
        {
            let cAddress = (mypos + i).toString(2).padStart(7, "0");
            // console.log("pos: " + (mypos+i) + " address: " + cAddress);
            let [tag, dado] = tuc(cAddress, this.num_linhas/2);
            
            this.cache[i]['validade'] = 1;
            this.cache[i]['tag'] = tag;
            this.cache[i]['dado'] = dado;
            console.log(`Dado ${dado} i: ${i}`);
        }
        this.updateCacheVisual();
    }
    static log(text)
    {
        let console = document.getElementById("cache-console");
        let old = console.value;
        console.value = text + "\n" + old;
    }
}



conso.clear = () => document.getElementById("console").value = "";
conso.log = (text) =>
{
    let console = document.getElementById("console");
    let old = console.value;
    console.value = text + "\n" + old;
} 

ram.add = (index, value = 0) =>
{
    key = "c_" + index;
    document.getElementById(key).value = value;
}

ram.get = (index) =>
{
    if (index in variables) {
        return document.getElementById("c_"+variables[index]);
    }
    return document.getElementById("c_"+index).value;
}

ram.newSlot = () =>
{
    let used = [];
    for (const [key, _] of Object.entries(variables)) {
        used.push(variables[key]);
    }
    index = initVarPos;
    while(used.includes(index))
    {
        index++;
    }
    if(index > 100)
    {
        console.log("RAM full");
        return null;
    }
    return index;
}

ram.clear = () =>
{
    document.getElementById("input").value = "";
    document.getElementById("output").value = "";
    variables = {};
    labels = {};
    pos = 0;
    fetchedData = []
    decodedData = []
    canFetch   = true;
    executePos = null;
    generateGrid();
}

accum.get = () =>
{
    return document.getElementById("accum").value
}

accum.set = (value) =>
{
    document.getElementById("accum").value = value;
}

const LABEL = (name, p) => labels[name] = p;
const DAT   = (name, value) =>
{
    let p = ram.newSlot();
    if (p != null)
    {
        variables[name] = p;
        ram.add(p, value);
        //document.getElementById("h_"+position).innerHTML = param[0];
    }
}

// Waits for passed amount of time
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Returns two slices of a string, cut at passed index
const cut = (str, index) => [str.slice(0, index), str.slice(index)];

async function accumSelect()
{
    console.log("A implementar..");
}

async function slotSelect(p, color, cacheOn = false)
{
    // SET PROGRAM COUNTER
    document.getElementById("program-counter").value = pos;

    let slot = document.getElementById("h_" + p);
    if(cacheOn)
    {
        let tRow = document.getElementById("r_" + pos % 4);
        tRow.style.backgroundColor = color;
        await sleep(50);
        tRow.style.backgroundColor = "transparent";
    }
    else
    {
        slot.style.backgroundColor = color;
        await sleep(clockSpeed);
        slot.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--main'); 
    }
}

async function fetch()
{
    if (canFetch)
    {
        pos = parseInt(pos);
        if(usingCache && myCache !== null)
        {
            if(myCache.accessCache(pos.toString(2).padStart(7, "0")) == 'hit')
            {
                await slotSelect(pos, "7b7246", true);
            }
            else
            {
                await slotSelect(pos, "7b7246"); //Amarelo
            }
        }
        else
        {
            await slotSelect(pos, "7b7246");
        }
        //await sleep(clockSpeed);
        let fetchedAddress = pos.toString(2).padStart(7, "0"); // Pega o id do slot e transforma em binário de 7 bits
        fetchedData.push(fetchedAddress); // Guarda na lista de fetch
        conso.log("Fetched: "+ fetchedAddress)
        canFetch = false;
    }
}

async function decode()
{
    // 6 - 7 - 8 -> BRs
    if (fetchedData[0] !== null && fetchedData[0] !== undefined)
    {
        let codedAddress = fetchedData.splice(0, 1); // Pega a instrução na ram em formato binário.
        executePos = parseInt(codedAddress[0], 2)
        let decodedAddress = ram.get(executePos); // Traduz para instrução em decimal.
        conso.log("decoded: "+ decodedAddress);
        let firstDigit = parseInt(decodedAddress.toString().charAt(0))
        if (![6, 7, 8, 0].includes(firstDigit)) // Se for branch ou halt
        {
            pos++;
            canFetch = true;
        }
        await slotSelect(executePos, "464d7b"); //Azul
        //await sleep(clockSpeed);
        decodedData.push(decodedAddress); // Guarda a instrução na lista de instruções
    }
}

async function execute()
{
    if (decodedData[0] !== null && decodedData[0] !== undefined)
    {
        let rawInstruction = decodedData.splice(0, 1);
        let [func, param] = cut(rawInstruction[0], 1);
        if ([6,7,8].includes(func))
        {
            functions[func](param);
            await slotSelect(executePos, "467b49"); //Verde
            return;
        }
        functions[func](param);
        await slotSelect(executePos, "467b49"); //Verde
    }
}

async function run()
{   
    myCache = new CacheMemory(4);
    myCache.initCache();
    usingPipeline = document.getElementById('using-pipeline').checked;
    usingCache = document.getElementById('using-cache').checked;
    const inicio = performance.now();
    while(pos != -1)
    {
        if (!usingPipeline) 
        {
            await fetch()
            await decode()
            await execute()
        }
        else
        {
            await Promise.all([execute(), decode(), fetch()]);
        }
    }
    const fim = performance.now();
    conso.log(`Execution time: ${(fim - inicio)/1000} seconds`);
}

function process(line, cl)
{
    if(line[0].includes(":"))
    {
        LABEL(line.shift().replace(":", ""), cl);
    }
    if(line.length == 1)
    {
        return [line[0], null]
    }
    if(line[1] == "DAT")
    {
        line.splice(1, 1);
        varsToCreate.push(line);
        return;
    }
    return line
}

// Was named compile, but load is a better description
function load()
{
    ram.clear();
    let code = document.getElementById("code").value
                .split("\n")
                .filter(value => value.trim() !== "")
                .map((line, i) => {
                  let processedLine = process(line.trim().split(/\s/), i);
                  return processedLine ? processedLine : null;
                })
                .filter(line => line !== null);

    initVarPos = code.length;
    varsToCreate.forEach(v => DAT(...v));
    code.forEach(([op, xx], i) => 
    {
        ram.add(i, generators[op](xx));
    });
}
