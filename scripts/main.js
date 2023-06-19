var variables = {};
var labels    = {};

var varsToCreate = [];

var initVarPos = 0;
var pos        = 0;

const functions = {};
const conso     = {};
const ram       = {};
const accum     = {};

var currentTheme = "dark";

// Machine Cycle 

var myCache       = null;
var fetchedData   = []
var decodedData   = []
var canFetch      = true;
var executePos    = null;
var usingPipeline = false;
var usingCache    = false;
var inputs        = [];
var writebackData = [];

var heat = 0;

// KEYWORD => OPCODE
const generators = 
{
    HLT: () => "000",
    INP: () => "901",
    OUT: () => "902",

    BRA: (label) => "6" + labels[label],
    BRP: (label) => "8" + labels[label],
    BRZ: (label) => "7" + labels[label],

    ADD: (value) => "1" + (Object.keys(variables).includes(value) ? variables[value] : value),
    SUB: (value) => "2" + (Object.keys(variables).includes(value) ? variables[value] : value),
    STA: (value) => "3" + (Object.keys(variables).includes(value) ? variables[value] : value),
    LDA: (value) => "5" + (Object.keys(variables).includes(value) ? variables[value] : value)
}

// BRA
functions["6"] = async function(newPos) 
{
    conso.log(text[currentLanguage]['consolebranch'](newPos));
    pos = newPos;
    canFetch = true;
};

// BRP
functions["8"] = async function(newPos) 
{
    if (accum.get() > 0) 
    {
        conso.log(text[currentLanguage]['consolebranch'](newPos));
        pos = newPos;
        canFetch = true;
        return;
    }
    conso.log(text[currentLanguage]['consoleignorebrp']());
    pos++;
    canFetch = true;
};

// BRZ
functions["7"] = async function(newPos) 
{
    if (accum.get() == 0) 
    {
        conso.log(text[currentLanguage]['consolebranch'](newPos));
        pos = newPos;
        canFetch = true;
        return;
    }
    conso.log(text[currentLanguage]['consoleignorebrz']());
    pos++;
    canFetch = true;
};

// INP & OUT (writeback)
functions["9"] = async function(value) 
{
    //Input
    if(value == "01")
    {
        document.getElementById('accum').style.backgroundColor = cpuColors['accumulator'];
        if (inputs.length > 0)
        {
            let input = inputs.shift();
            accum.set(input);
            conso.log(text[currentLanguage]['consoleinput'](input));
        }
        //Input without argument
        else
        {
            accum.set(0);
            conso.log(text[currentLanguage]['consoleinput'](0));
        }
        const display = document.getElementById("writeback-display");
        display.value = accum.get();
    }
    //Output
    else
    {
        let outputValue = accum.get();
        conso.log(text[currentLanguage]['consoleoutput'](outputValue));
        document.getElementById("output").value += outputValue + " ";
    }
    updateMDR();
}

// HLT
functions["0"] = async function() 
{
    conso.log(text[currentLanguage]['consolehalt']());
    pos = -1;
}

// ADD (writeback)
functions["1"] = async function(p) 
{
    let value = ram.get(p);
    document.getElementById('accum').style.backgroundColor = cpuColors['accumulator'];
    conso.log(text[currentLanguage]['consoleadd'](value));
    accum.set(parseInt(accum.get()) + parseInt(value));
    const display = document.getElementById("writeback-display");
    display.value = accum.get();
    updateMDR();
    updateMAR((pos - 1).toString(2).padStart(7, "0"));
}

// SUB (writeback)
functions["2"] = async function(p) 
{
    let value = ram.get(p);
    document.getElementById('accum').style.backgroundColor = cpuColors['accumulator'];
    conso.log(text[currentLanguage]['consolesub'](value));
    accum.set(parseInt(accum.get()) - parseInt(value));
    const display = document.getElementById("writeback-display");
    display.value = accum.get();
    updateMDR();
    updateMAR((pos - 1).toString(2).padStart(7, "0"));
}

// STA
functions["3"] = async function(p) 
{
    let value = accum.get();
    conso.log(text[currentLanguage]['consolesta'](p, value));
    ram.add(p, value);
    updateMDR();
    updateMAR((pos - 1).toString(2).padStart(7, "0"));
}

// LDA (writeback)
functions["5"] = async function(p) 
{
    document.getElementById('accum').style.backgroundColor = cpuColors['accumulator'];
    conso.log(text[currentLanguage]['consolelda'](p));
    accum.set(ram.get(p));
    const display = document.getElementById("writeback-display");
    display.value = accum.get();
    updateMDR();
    updateMAR((pos - 1).toString(2).padStart(7, "0"));
}

// ------------------------------------------------ //

updateMDR = () => {
    document.getElementById("memory-data-register").value = accum.get();
}

updateMAR = (data) => {
    document.getElementById("memory-address-register").value = data;
}

updateCIR = (address) => {
    document.getElementById("current-instruction-register").value = address;
}

function opcode2String(opcode)
{
    const opcodes = 
    {
        "0": "HALT",
        "1": "ADD",
        "2": "SUB",
        "3": "STA",
        "5": "LDA",
        "6": "BRA",
        "7": "BRZ",
        "8": "BRP"
    }

    if (opcode == "901")
    {
        return "INP";
    }
    if (opcode == "902")
    {
        return "OUT";
    }

    let char = opcode.toString().charAt(0);

    return opcodes[char];
}

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

function changeTheme()
{
    const root = document.documentElement;
    document.getElementById("theme-button").innerHTML = currentTheme + "_mode"

    if(currentTheme === "dark")
    {
        currentTheme = "light"
    }
    else
    {
        currentTheme = "dark"
        
    }

    Object.keys(theme[currentTheme]).forEach(key =>
    {
        root.style.setProperty(key, theme[currentTheme][key]);
    })

    for(let i = 0; i < 100; i++)
    {
        const slotH = document.getElementById("h_" + i);
        slotH.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(theme[currentTheme]['--main']);
    }
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
        generateCache()
    }

    async updateCacheVisual()
    {
        for(let i = 0; i < this.num_linhas; i++)
        {
            const tRow = document.getElementById('r_' + i);
            const tTag = document.getElementById('t_' + i);
            const tValid = document.getElementById('v_' + i);
            const tData = document.getElementById('d_' + i);
            tTag.value = this.cache[i].tag;
            tValid.value = this.cache[i].validade;
            tData.value = this.cache[i].dado; 
            let newPos = parseInt((this.cache[i].tag + this.cache[i].dado), 2);
            const slot = document.getElementById('h_' + newPos);
            slot.style.backgroundColor = instructionColors["cache"];
            tRow.style.backgroundColor = instructionColors["cache"];
            await sleep(clockSpeed/2);
            tRow.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(theme[currentTheme]['--main']); 
            slot.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(theme[currentTheme]['--main']); 
        }
    }

    accessCache(address)
    {
        let [tag, dado] = tuc(address, this.num_linhas/2);
        for(let i = 0; i < this.num_linhas; i++)
        {
            if (this.cache[i]["validade"] == 1 && this.cache[i]['tag'] == tag && this.cache[i]['dado'] == dado)
            {
                CacheMemory.log(text[currentLanguage]['cachehit'](tag + dado));
                return 'hit';
            }
        }
        CacheMemory.log(text[currentLanguage]['cachemiss'](tag + dado));
        this.storeCache(address);
        return 'miss';
    }

    storeCache(address)
    {
        let mypos = parseInt(address, 2) + 1;
        for(let i = 0; i < this.num_linhas; i++)
        {
            let cAddress = (mypos + i).toString(2).padStart(7, "0");
            let [tag, dado] = tuc(cAddress, this.num_linhas/2);
            
            this.cache[i]['validade'] = 1;
            this.cache[i]['tag'] = tag;
            this.cache[i]['dado'] = dado;
        }
        this.updateCacheVisual();
    }
    static log(text)
    {
        const console = document.getElementById("cache-console");
        let old = console.value;
        console.value = text + "\n" + old;
    }
    static logClear()
    {
        const console = document.getElementById("cache-console");
        console.value = "";
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
    if (index in variables) 
    {
        return document.getElementById("c_" + variables[index]);
    }
    return document.getElementById("c_" + index).value;
}

ram.newSlot = () =>
{
    let used = [];
    for (const [key, _] of Object.entries(variables)) 
    {
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

ram.clear = (out = true) =>
{
    if (out)
    {
        document.getElementById("output").value = "";
    }
    variables = {};
    labels = {};
    pos = 0;
    fetchedData = []
    decodedData = []
    canFetch   = true;
    executePos = null;
    generateGrid();
    myCache = null;
    executePos = null;
    inputs = [];
}

accum.get = () =>
{
    return document.getElementById("accum").value;
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
        let tRow = document.getElementById("r_" + pos % myCache.num_linhas);
        tRow.style.backgroundColor = color;
        await sleep(5);
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
    const display = document.getElementById('fetch-display');
    if (canFetch)
    {
        pos = parseInt(pos);
        let fetchedAddress = pos.toString(2).padStart(7, "0"); // Pega o id do slot e transforma em binário de 7 bits
        updateCIR(fetchedAddress);
        conso.log(text[currentLanguage]["fetching"](fetchedAddress));
        if(usingCache && myCache !== null)
        {
            if(await myCache.accessCache(pos.toString(2).padStart(7, "0")) == 'hit')
            {
                await slotSelect(pos, instructionColors["fetch"], true);
                fetchedData.push(fetchedAddress); // Guarda na lista de fetch
                canFetch = false;
                display.value = fetchedAddress;
                return;
            }
            else
            {
                await slotSelect(pos, instructionColors["fetch"]);
            }
        }
        else
        {
            await slotSelect(pos, instructionColors["fetch"]);
        }
        fetchedData.push(fetchedAddress); // Guarda na lista de fetch
        display.value = fetchedAddress;
        canFetch = false;
    }
}

async function decode()
{
    const display = document.getElementById('decode-display');
    if (fetchedData[0] !== null && fetchedData[0] !== undefined)
    {
        let codedAddress = fetchedData.splice(0, 1); // Pega a instrução na ram em formato binário.
        executePos = parseInt(codedAddress[0], 2)
        let decodedAddress = ram.get(executePos); // Traduz para instrução em decimal.
        if (currentLanguage == "english")
        {
            conso.log("Decoded: "+ decodedAddress);
        }
        else
        {
            conso.log("Decodificado: "+ decodedAddress);
        }
        let firstDigit = decodedAddress.toString().charAt(0);
        if (!['6', '7', '8', '0'].includes(firstDigit)) // Se não for branch ou halt
        {
            pos++;
            canFetch = true;
        }
        await slotSelect(executePos, instructionColors["decode"]);
        display.value = decodedAddress;
        decodedData.push(decodedAddress); // Guarda a instrução na lista de instruções
    }
}

async function execute()
{
    const display = document.getElementById('execute-display');
    if (decodedData[0] !== null && decodedData[0] !== undefined)
    {
        let rawInstruction = decodedData.splice(0, 1);
        let [func, param] = cut(rawInstruction[0], 1);
        if (['6','7','8'].includes(func))
        {
            functions[func](param);
            await slotSelect(executePos, instructionColors["execute"]);
            document.getElementById('accum').style.backgroundColor = 'transparent';
            display.value = opcode2String(func + param);
            return;
        }
        //If Writeback, call writeback function, return
        if (['9','1','2','5'].includes(func))
        {
            conso.log("Sending to writeback");
            writebackData.push({"func": func, "param": param});
            await slotSelect(executePos, instructionColors["execute"]);
            document.getElementById('accum').style.backgroundColor = 'transparent';
            display.value = opcode2String(func + param);
            return;
        }
        functions[func](param);
        await slotSelect(executePos, instructionColors["execute"]);
        display.value = opcode2String(func + param);
        document.getElementById('accum').style.backgroundColor = 'transparent';
    }
}

async function writeback()
{
    if (writebackData[0] !== null && writebackData[0] !== undefined)
    {
        if (usingPipeline)
        {
            let data = writebackData.shift();
            let writeSlot = executePos - 1;
            functions[data.func](data.param);
            await slotSelect(writeSlot, instructionColors["writeback"]);
        }
        else
        {
            let data = writebackData.shift();
            let writeSlot = executePos;
            functions[data.func](data.param);
            await slotSelect(writeSlot, instructionColors["writeback"]);
        }
    }
}

function haltCode()
{
    if (pos > 0)
    {
        pos = -1;
        conso.log(text[currentLanguage]["manualhalt"])
    }
}

async function run()
{   
    load();
    inputs = document.getElementById('input').value.split(/[\s\n]+/);
    inputs = inputs.filter(element => element != "");
    let allInt = true;

    for (const input of inputs) 
    {
        if (!Number.isInteger(parseFloat(input))) 
        {
            allInt = false;
            break;
        }
    }

    if (!allInt) 
    {
        conso.log(text[currentLanguage]["invalidinputs"]);
        return;
    } 

    const start = performance.now();
    usingPipeline = document.getElementById('using-pipeline').checked;
    while(pos != -1)
    {
        if (pos == initVarPos)
        {
            conso.log([currentLanguage]["missinghalt"]);
            break;
        }
        if (!usingPipeline) 
        {
            await fetch();
            await decode();
            await execute();
            await writeback();
        }
        else
        {
            await Promise.all([writeback(), execute(), decode(), fetch()]);
        }
    }
    pos = 0;
    const end = performance.now();
    conso.log(text[currentLanguage]['executiontime'](start, end));
    ram.clear(out=false);
}

function process(line, cl)
{
    if(!(Object.keys(generators).includes(line[0])) && line[1] != "DAT")
    {
        LABEL(line.shift(), cl);
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
    usingCache = document.getElementById('using-cache').checked;
    if (usingCache)
    {
        let cacheSize = getCheckedRadioValue("opcao");
        myCache = new CacheMemory(cacheSize);
        myCache.initCache();
    }
}

function clearCacheTerminal()
{
    document.getElementById("cache-console").value = "";
}

function getCheckedRadioValue(name) 
{
    var radioButtons = document.querySelectorAll('input[type="radio"][name="' + name + '"]');
    var checkedButton = Array.from(radioButtons).find(radio => radio.checked);
    return checkedButton ? checkedButton.value : null;
}   

