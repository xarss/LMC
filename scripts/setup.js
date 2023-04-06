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

generateGrid();