document.getElementById('code').addEventListener('keydown', function(e) {
    if (e.key == 'Tab')
    {
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
    if (e.key == " ")
    {
        e.preventDefault();
        let textarea = document.activeElement;
        let cursorPos = textarea.selectionStart;
        let text = textarea.value;
        textarea.value = text.substring(0, cursorPos) + "\t" + text.substring(cursorPos);
        textarea.setSelectionRange(cursorPos + 1, cursorPos + 1);
    }
});

function Overlay() {
    let current = document.getElementById("overlay").style.display;
    if (current == "block")
    {
        document.getElementById("overlay").style.display = "none";
    }
    else
    {
        document.getElementById("overlay").style.display = "block";
    }
}

function slotter(index)
{
    let slot = document.createElement('td');
    // Set class
    slot.className = "slot";
    let slotHeader = document.createElement('div');
    slotHeader.setAttribute("id", "h_" + index);
    // Set class
    slotHeader.className = "slotHeader";
    slotHeader.appendChild(document.createTextNode(index));

    let slotBody = document.createElement('div');
    slotBody.className = "slotBody";
    
    let value = document.createElement('input');
    value.className = "clearInput";

    id = "c_" + index.toString();
    value.setAttribute("id", id);
    value.setAttribute("value", "000")

    slotBody.appendChild(value);

    slot.appendChild(slotHeader);
    slot.appendChild(slotBody);

    return slot;
}

function generateGrid()
{
    var body = document.getElementById("slots");
    body.innerHTML = "";
    var table = document.createElement("table");
    // Set class for table
    table.className = "cacheTable";

    for(let i = 0; i < 10; i++)
    {
        let row = document.createElement('tr');
        // Set class
        row.className = "cacheRow"
        for(let j = 1; j < 11; j++)
        {
            row.appendChild(slotter((10 * i) + j));
        }
        table.appendChild(row);
    }
    body.appendChild(table);
}

function changeColor()
{
    color = document.getElementById("colorPicker").value
    var css = document.querySelector(':root');
    css.style.setProperty("--secondary", color)
}

function generateInfoTable()
{
    let table = document.getElementById("info-table");
    let contentHead = ["Command name", "Syntax", "Description"]
    let contentBody = [
    {
        "command_name": "Input",
        "syntax": "INP",
        "description": "Gets an input from user." 
    },
    {
        "command_name": "Output",
        "syntax": "OUT",
        "description": "Outputs the accumulator's value on the output terminal." 
    },
    {
        "command_name": "Add",
        "syntax": "ADD [value]",
        "description": "Adds the specified value to the accumulator." 
    },
    {
        "command_name": "Subtract",
        "syntax": "SUB [value]",
        "description": "Subtracts the specified value to the accumulator." 
    },
    {
        "command_name": "Load",
        "syntax": "LDA [memory address]",
        "description": "Loads the accumulator with the content stored at the given memory address." 
    },
    {
        "command_name": "Store",
        "syntax": "STA [memory address]",
        "description": "Stores the accumulator's value inside the given memory address." 
    },
    {
        "command_name": "Branch Always",
        "syntax": "BRA [label]",
        "description": "Jump to given label." 
    },
    {
        "command_name": "Branch If Positive",
        "syntax": "BRP [label]",
        "description": "Jump to given label if the content in the accumulator is positive." 
    },
    {
        "command_name": "Branch If Zero",
        "syntax": "BRZ [label]",
        "description": "Jump to given label if the content in the accumulator is equal to zero." 
    },
    {
        "command_name": "Halt",
        "syntax": "HLT",
        "description": "Stops the code." 
    },
    {
        "command_name": "Data Location",
        "syntax": "DAT [name] [value]",
        "description": "Associate a label to a memory address, if given a value, it will store it in memory. (value is optional)" 
    }
    ]
    
    const tableHead = document.getElementById("info-table-head");
    const tableBody = document.getElementById("info-table-body");
    tableHead.innerHTML = "<tr><th>Command Name</th><th>Syntax</th><th>Description</th</tr>";

    contentBody.forEach(element => 
    {
        tableBody.innerHTML += 
        "<tr>"+
        `<td>${element.command_name}</td>`+
        `<td>${element.syntax}</td>`+
        `<td>${element.description}</td>`+
        "</tr>";
    });

}

//Define initial clock speed
document.getElementById("current-clock-speed").innerHTML = 200;


generateInfoTable();
generateGrid();