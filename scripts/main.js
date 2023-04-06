var variables = {};
var labels    = {};
var functions = {};

var pos = 0;

// --- Funções que representam as keywords do little man --- //

functions.LABEL = function(param) {
    position = param[0]
    nam = param[1]
    labels[nam] = position;
    console.log(labels);
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

functions.DAT = function(name) {
    position = getRAMSlot();
    if (position != null) {
        newVar(name, getRAMSlot());
        document.getElementById("h_"+position).innerHTML = name;
    }
}

functions.INP = function() {
    let input = prompt('Input: ');
    setAccum(input)
    document.getElementById("input").value += input + "\n";
};

functions.OUT = function() {
    document.getElementById("output").innerHTML += getAccum() + "\n";
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

function addToRegister(index, value)
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
}

function clearRun() {
    variables = {}
    labels = {}
    
}

function run(code)
{
    let size = code.length
    let halt = null;
    pos = labels["start"];
    console.log("Pos on start:" + pos);

    while(halt == null)
    {
        let func = code[pos][0];
        let param = code[pos][1];
        halt = functions[func](param);
        pos++;
    }
    console.log(variables);
    console.log("Programa finalizou execução");
}

function process(line, cl)
{
    console.log("reading line: " + line);
    if(line.length > 2)
    {
        return null
    }
    if(line[0].includes(":"))
    {
        functions.LABEL([cl, line[0].replace(":", "")])
        return ["LABEL", [cl, line[0].replace(":", "")]];
    }
    if(line.length == 1)
    {
        return [line[0], null]
    }
    if(line[1] == "DAT")
    {
        return ["DAT", line[0]]
    }
    return line
}

function compile()
{
    let raw = document.getElementById("code").value;
    let rawLines = raw.split("\n");

    console.log(rawLines)

    let errors = [];
    let code = [];
    let cleanLine = [];

    let currentLine = 0
    rawLines.forEach(line => {
        line.trim().split("\t").forEach(word => {
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
