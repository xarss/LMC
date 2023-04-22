var variables = {};
var labels    = {};

var varsToCreate = [];

var initVarPos = 0;
var pos        = 0;

const functions = {};
const conso     = {};
const ram       = {};
const accum     = {};

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
};

// BRP
functions["8"] = async function(newPos) {
    if (accum.get() > 0) {
        conso.log("Jumping to postion " + newPos)
        pos = newPos;
        return
    }
    pos++;
};

// BRZ
functions["7"] = async function(newPos) {
    if (accum.get() == 0) {
        conso.log("Jumping to postion " + newPos)
        pos = newPos;
        return;
    }
    pos++;
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
    pos++;
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
    pos++;
}

// SUB
functions["2"] = async function(p) {
    let value = ram.get(p);
    conso.log("Subtracting " + value + " from accumulator");
    accum.set(parseInt(accum.get()) - parseInt(value));
    pos++;
}

// STA
functions["3"] = async function(p) {
    let value = accum.get();
    conso.log("Storing at " + p + " value: " + value)
    ram.add(p, value);
    pos++;
}

// LDA
functions["5"] = async function(p) {
    conso.log("Loading from " + p + " to accumulator");
    accum.set(ram.get(p));
    pos++;
}

// ------------------------------------------------ //

conso.clear = () => document.getElementById("console").value = "";
conso.log = (text) =>
{
    let console = document.getElementById("console");
    let old = console.value;
    console.value = text + "\n" + old;
} 

ram.add = (index, value = 0) =>
{
    key = "c_" + index.toString();
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

async function slotSelect(p)
{
    // SET PROGRAM COUNTER
    document.getElementById("program-counter").value = pos;

    let slot = document.getElementById("h_" + p);
    slot.className = "selected-slotHeader";
    await sleep(clockSpeed);
    slot.className = "slotHeader";
}

async function run()
{   
    while(pos != -1)
    {
        await slotSelect(pos);
        let instruction = ram.get(pos);
        let [func, param] = cut(instruction, 1);
        functions[func](param);
    }
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
