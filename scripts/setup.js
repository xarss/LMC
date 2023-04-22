var cardState = true;

var clockSpeed   = document.getElementById("slider").value;
var previousCode = "custom";

var cacheState = false;

function Overlay() {
    const current = document.getElementById("overlay");
    if (current.style.display == "block")  {
        current.style.display = "none";
    }
    else {
        current.style.display = "block";
    }
}

function slotter(index) {
    const slot = document.createElement('td');
    slot.className = 'slot';

    const slotHeader = document.createElement('div');
    slotHeader.id = `h_${index}`;
    slotHeader.className = 'slotHeader';
    let nam = index.toString();
    nam = nam.length == 1? "0" + nam : nam;
    slotHeader.textContent = nam;

    const slotBody = document.createElement('div');
    slotBody.className = 'slotBody';

    const value = document.createElement('input');
    value.className = 'clearInput';
    value.id = `c_${index}`;
    value.value = '000';

    slotBody.appendChild(value);
    slot.append(slotHeader, slotBody);

    return slot;
}

function setClockSpeed()
{
    clockSpeed = 2010 - parseInt(document.getElementById("slider").value)
    document.getElementById("current-clock-speed").innerHTML = clockSpeed;
}

function generateGrid() {
    const table = document.getElementById('slots');
    table.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        row.className = 'cacheRow';

        for (let j = 0; j < 10; j++) {
            row.insertAdjacentElement('beforeend', slotter(10 * i + j));
        }

        table.insertAdjacentElement('beforeend', row);
    }
}

function changeColor() {
    color = document.getElementById("colorPicker").value
    var css = document.querySelector(':root');
    css.style.setProperty("--secondary", color)
}

function generateInfoTable() {
    let contentBody = [
        {
            "command_name": "Input",
            "syntax": "INP",
            "description": "Gets an input from user.",
            "opcode": "901"
        },
        {
            "command_name": "Output",
            "syntax": "OUT",
            "description": "Outputs the accumulator's value on the output terminal.",
            "opcode": "902"
        },
        {
            "command_name": "Add",
            "syntax": "ADD [value]",
            "description": "Adds the specified value to the accumulator.",
            "opcode": "1xx"
        },
        {
            "command_name": "Subtract",
            "syntax": "SUB [value]",
            "description": "Subtracts the specified value to the accumulator.",
            "opcode": "2xx"
        },
        {
            "command_name": "Load",
            "syntax": "LDA [memory address]",
            "description": "Loads the accumulator with the content stored at the given memory address.",
            "opcode": "5xx"
        },
        {
            "command_name": "Store",
            "syntax": "STA [memory address]",
            "description": "Stores the accumulator's value inside the given memory address.",
            "opcode": "3xx"
        },
        {
            "command_name": "Branch Always",
            "syntax": "BRA [label]",
            "description": "Jump to given label.",
            "opcode": "6xx"
        },
        {
            "command_name": "Branch If Positive",
            "syntax": "BRP [label]",
            "description": "Jump to given label if the content in the accumulator is positive.",
            "opcode": "8xx"
        },
        {
            "command_name": "Branch If Zero",
            "syntax": "BRZ [label]",
            "description": "Jump to given label if the content in the accumulator is equal to zero.",
            "opcode": "7xx"
        },
        {
            "command_name": "Halt",
            "syntax": "HLT",
            "description": "Stops the code.",
            "opcode": "000"
        },
        {
            "command_name": "Data Location",
            "syntax": "DAT [name] [value]",
            "description": "Associate a label to a memory address, if given a value, it will store it in memory. (value is optional)",
            "opcode": ""
        }
    ]

    const tableHead = document.getElementById("info-table-head");
    const tableBody = document.getElementById("info-table-body");
    tableHead.innerHTML = "<tr><th>Command Name</th><th>Syntax</th><th>Description</th><th>Opcode</th></tr>";

    contentBody.forEach(element => {
        tableBody.innerHTML +=
            "<tr>" +
            `<td>${element.command_name}</td>` +
            `<td>${element.syntax}</td>` +
            `<td>${element.description}</td>` +
            `<td>${element.opcode}</td>`+
            "</tr>";
    });
}

function startWithTerminal()
{
    document.getElementById("switch").innerHTML = terminal.innerHTML;
}

function switchTerminalCache()
{
    let terminal  = document.getElementById("terminal");
    let cache     = document.getElementById("cache");

    if(terminal.className === "switch-active")
    {
        terminal.className = "switch-hidden";
        cache.className    = "switch-active";
        return
    }
    
    terminal.className = "switch-active";
    cache.className    = "switch-hidden";
}

function getPreviousCode()
{
    previousCode = document.getElementById("code-examples").value;
    codes[previousCode] = document.getElementById("code").value;
}

function pasteCodeExample()
{
    const codeEditor  = document.getElementById("code");
    const currentCode = document.getElementById("code-examples").value;

    if(previousCode == "custom")
    {
        codes["custom"] = codeEditor.value;
    }
    
    codeEditor.value = codes[currentCode];
}

document.getElementById('code').addEventListener('keydown', function(e) {
  if (e.key === 'Tab' || e.key === ' ') {
    e.preventDefault();
    const startPos = this.selectionStart;
    const endPos = this.selectionEnd;
    const value = this.value;
    this.value = value.substring(0, startPos) + '\t' + value.substring(endPos);
    this.selectionStart = this.selectionEnd = startPos + 1;
  }
});


//Define initial clock speed
document.getElementById("current-clock-speed").innerHTML = 200;

generateInfoTable();
generateGrid();