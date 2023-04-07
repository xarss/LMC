var variables = {};
var labels    = {};
const functions = {};
var pos = 0;

// --- Funções que representam as keywords do little man --- //

functions.LABEL = function(param) {
    labels[param[1]] = param[0];
};

functions.BRA = function(label) {
    pos = labels[label];
};

functions.BRP = function(label) {
    if (getAccum() > 0) {
        pos = labels[label];
    }
};

functions.BRZ = function(label) {
    if (getAccum() == 0) {
        pos = labels[label];
    }
};

functions.DAT = function(param) {
    position = getRAMSlot();
    if (position != null) {
        newVar(param[0], getRAMSlot());
        addToRegister(position, param[1]);
        document.getElementById("h_"+position).innerHTML = param[0];
    }
}

functions.INP = function() {
    let input = prompt('Input: ');
    setAccum(input)
    document.getElementById("input").value += input + "\n";
};

functions.OUT = function() {
    document.getElementById("output").value += getAccum() + "\n";
}

functions.HLT = function() {
    return true;
}

functions.ADD = function(value) {
    value = isVariable(value);
    setAccum(parseInt(getAccum()) + parseInt(value));
}

functions.SUB = function(value) {
    value = isVariable(value);
    setAccum(parseInt(getAccum()) - parseInt(value));
}

functions.STA = function(varName) {
    if((varName in variables)) { 
        addToRegister(variables[varName], getAccum());
        return
    }
    addToRegister(parseInt(varName), getAccum());
}

functions.LDA = function(varName) {
    let position = variables[varName];
    if (position != null)
        setAccum(getFromRegister(position));
    else {
        setAccum(varName);
    }
}

// ------------------------------------------------ //

function isVariable(variable) {
    if (variable in variables) {
        return document.getElementById("c_" + variables[variable]).value;
    }
    return variable;
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
    index = 1;
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

async function run(code)
{
    let size = code.length
    let halt = null;
    

    while(halt == null)
    {
        await sleep(510 - parseInt(document.getElementById("current-clock-speed").innerHTML));
        let func = code[pos][0];
        let param = code[pos][1];
        halt = functions[func](param);
        pos++;
    }
    
    console.log("Programa finalizou execução");
    console.log(variables)
}

function process(line, cl)
{
    if(line[0].includes(":"))
    {
        let labelName = line.shift();
        functions.LABEL([cl - 1, labelName.replace(":", "")])
    }
    if(line.length == 1)
    {
        return [line[0], null]
    }
    if(line[1] == "DAT")
    {
        line.splice(1, 1);
        console.log(line)
        functions.DAT([...line]);
        return ["DAT", line[0]];
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
    if(errors.length == 0)
    {
        run(code);
    }
    else
    {
        errors.forEach(err => {
            console.log(err)
        })
    }
}

function pasteCodeExample()
{
    const codeArea = document.getElementById("code");
    const codeExample = document.getElementById("code-examples").value;
    
    codeArea.value = codes[codeExample];
}

function changeClockValue()
{
    new_value = document.getElementById("slider").value;
    document.getElementById("current-clock-speed").innerHTML = new_value;
}
