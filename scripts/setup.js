document.getElementById('code').addEventListener('keydown', function (e) {
    if (e.key == 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.value = this.value.substring(0, start) +
            "\t" + this.value.substring(end);

        // put caret at right position again
        this.selectionStart =
            this.selectionEnd = start + 1;
    }
    if (e.key == " ") {
        e.preventDefault();
        let textarea = document.activeElement;
        let cursorPos = textarea.selectionStart;
        let text = textarea.value;
        textarea.value = text.substring(0, cursorPos) + "\t" + text.substring(cursorPos);
        textarea.setSelectionRange(cursorPos + 1, cursorPos + 1);
    }
});

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
    slotHeader.textContent = index;

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


function generateGrid() {
    const body = document.getElementById('slots');
    body.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'cacheTable';

    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        row.className = 'cacheRow';

        for (let j = 1; j < 11; j++) {
            row.insertAdjacentElement('beforeend', slotter(10 * i + j));
        }

        table.insertAdjacentElement('beforeend', row);
    }

    body.insertAdjacentElement('beforeend', table);
}


function changeColor() {
    color = document.getElementById("colorPicker").value
    var css = document.querySelector(':root');
    css.style.setProperty("--secondary", color)
}

function generateInfoTable() {
    let table = document.getElementById("info-table");
    let contentHead = ["Command name", "Syntax", "Description", "Opcode"]
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

//Define initial clock speed
document.getElementById("current-clock-speed").innerHTML = 200;


generateInfoTable();
generateGrid();