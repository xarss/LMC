var variables = {};
var labels    = {};
const functions = {};
const generators = {};
var pos = 0;
var varsToCreate = [];
var initVarPos = 0;

// ------- Funções que traduzem keywords para OPCODE ------- //

generators.BRA = function(label) {
    return "6" + labels[label];
};

generators.BRP = function(label) {
    return "8" + labels[label];
};

generators.BRZ = function(label) {
    return "7" + labels[label];
}

generators.INP = function() {
    return "901";
};

generators.OUT = function() {
    return "902";
}

generators.HLT = function() {
    return "000";
}

generators.ADD = function(value) {
    let pos = variables[value];
    return "1" + pos;
}

generators.SUB = function(value) {
    let pos = variables[value];
    return "2" + pos;
}

generators.STA = function(varName) {
    let pos = variables[varName];
    return "3" + pos;
}

generators.LDA = function(varName) {
    let pos = variables[varName];
    return "5" + pos;
}

function LABEL(param) {
    labels[param[1]] = param[0];
};

function DAT(param) {
    position = getRAMSlot();
    if (position != null) {
        newVar(param[0], getRAMSlot());
        addToRegister(position, param[1]);
        //document.getElementById("h_"+position).innerHTML = param[0];
    }
}

// BRA
functions["6"] = async function(newPos) {
    conso.log("Jumping to postion " + newPos)
    pos = newPos;
};

// BRP
functions["8"] = async function(newPos) {
    if (getAccum() > 0) {
        conso.log("Jumping to postion " + newPos)
        pos = newPos;
        return
    }
    pos++;
};

// BRZ
functions["7"] = async function(newPos) {
    if (getAccum() == 0) {
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
        setAccum(input)
        document.getElementById("input").value += input + "\n";
    }
    else
    {
        conso.log("Outputing accumulator value");
        document.getElementById("output").value += getAccum() + "\n";
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
    let value = getFromRegister(p);
    conso.log("Adding " + value + " to accumulator");
    setAccum(parseInt(getAccum()) + parseInt(value));
    pos++;
}

// SUB
functions["2"] = async function(p) {
    let value = getFromRegister(p);
    conso.log("Subtracting " + value + " from accumulator");
    setAccum(parseInt(getAccum()) - parseInt(value));
    pos++;
}

// STA
functions["3"] = async function(p) {
    let value = getAccum();
    conso.log("Storing at " + p + " value: " + value)
    addToRegister(p, value);
    pos++;
}

// LDA
functions["5"] = async function(p) {
    conso.log("Loading from " + p + " to accumulator");
    setAccum(getFromRegister(p));
    pos++;
}

// ------------------------------------------------ //

const conso = {}

conso.clear = () => document.getElementById("console").value = "";
conso.log = (text) =>
{
    let console = document.getElementById("console");
    let old = console.value;
    console.value = text + "\n" + old;
} 

function addToRegister(index, value = 0)
{
    key = "c_" + index.toString();
    document.getElementById(key).value = value;
}

function getFromRegister(index) {
    if (index in variables) {
        return document.getElementById("c_"+variables[index]);
    }
    return document.getElementById("c_"+index).value;
}

function getAccum()
{
    return document.getElementById("accum").value
}

function setAccum(value)
{
    document.getElementById("accum").value = value;
}

function sendError()
{
    // To implement. Receives a type of error and logs
    console.log("error!");
}

function getRAMSlot()
{
    let used = [];
    for (const [key, value] of Object.entries(variables)) {
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

function newVar(nam, pos)
{
    variables[nam] = pos;
    return pos;
}

function clearMemory() {
    document.getElementById("input").value = "";
    document.getElementById("output").value = "";
    variables = {};
    labels = {};
    pos = 0;
    generateGrid();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function accumSelect()
{
    console.log("A implementar..");
}

async function slotSelect(p)
{
    let slot = document.getElementById("h_" + p);
    slot.className = "selected-slotHeader";
    await sleep(clockSpeed);
    slot.className = "slotHeader";
}

function cut(str, index) {
    return [str.slice(0, index), str.slice(index)];
}

async function run()
{   
    while(pos != -1)
    {
        await slotSelect(pos);
        let instruction = getFromRegister(pos);
        let [func, param] = cut(instruction, 1);
        console.log("Running: " + func + param);
        functions[func](param);
    }
}

function process(line, cl)
{
    if(line[0].includes(":"))
    {
        let labelName = line.shift();
        LABEL([cl, labelName.replace(":", "")])
    }
    if(line.length == 1)
    {
        return [line[0], null]
    }
    if(line[1] == "DAT")
    {
        line.splice(1, 1);
        varsToCreate.push(line)
        return;
    }
    return line
}

function compile()
{
    clearMemory();
    let raw = document.getElementById("code").value;
    let rawLines = raw.split("\n");
    rawLines = rawLines.filter(function(value) {
        return value !== "";
    });

    let errors = [];
    let code = [];
    let cleanLine = [];

    let currentLine = 0;
    rawLines.forEach(line => {
        line.replace(/\s+/g, " ").trim().split(" ").forEach(word => {
            let w = word.trim();
            w ? cleanLine.push(w) : null;
        });
        cleanLine = process(cleanLine, currentLine);
        currentLine++;
        if(cleanLine != null)
        {
            code.push(cleanLine);
        }
        cleanLine = [];
    });
    initVarPos = code.length;
    varsToCreate.forEach(vari => {
        DAT(vari);
    })
    for(let i = 0; i < code.length; i++)
    {
        let op = code[i][0];
        let xx = code[i][1];
        let opcode = generators[op](xx);
        addToRegister(i, opcode);
    }
}

function pasteCodeExample()
{
    const codeArea = document.getElementById("code");
    const codeExample = document.getElementById("code-examples").value;
    
    codeArea.value = codes[codeExample];
}
