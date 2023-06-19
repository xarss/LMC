var cardState = true;
const defaultLanguage = "english";
var currentLanguage = defaultLanguage;

var clockSpeed = 1000;
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
    let sliderValue = document.getElementById("slider").value;
    clockSpeed = 1000 - 900 * ((sliderValue - 1) / 10);
    document.getElementById("current-clock-speed").innerHTML = (sliderValue/10).toFixed(1);
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

function generateInfoTable(lang) {
    const tableHead = document.getElementById("info-table-head");
    const tableBody = document.getElementById("info-table-body");
    tableHead.innerHTML = "<tr><th class='commandname'></th><th class='syntax'></th><th class='description'></th><th>Opcode</th></tr>";
    tableBody.innerHTML = "";

    commands[lang].forEach(element => {
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

function newCacheLine(index)
{
    const tr   = document.createElement("tr");
    tr.id = "r_" + index;

    const val  = document.createElement("td");
    const tag  = document.createElement("td");
    const data = document.createElement("td");

    const val_content  = document.createElement("div");
    const tag_content  = document.createElement("div");
    const data_content = document.createElement("div");

    const val_input  = document.createElement("input");
    const tag_input  = document.createElement("input");
    const data_input = document.createElement("input");

    val_input.value  = "000";
    tag_input.value  = "000";
    data_input.value = "000"

    val_content.className  = "flex-center";
    tag_content.className  = "flex-center";
    data_content.className = "flex-center";

    val_input.className  = "clearInput";
    tag_input.className  = "clearInput";
    data_input.className = "clearInput";
    
    val_input.id  = "v_" + index;
    tag_input.id  = "t_" + index;
    data_input.id = "d_" + index;

    val_content.appendChild ( val_input  );
    tag_content.appendChild ( tag_input  );
    data_content.appendChild( data_input );

    val.appendChild ( val_content  );
    tag.appendChild ( tag_content  );
    data.appendChild( data_content );
    
    tr.appendChild( val  );
    tr.appendChild( tag  );
    tr.appendChild( data );
    
    return tr;
}

function generateCache()
{
    let body = document.getElementById( "cache-body" );
    body.innerHTML  = "<tr><th> Val  </th><th> Tag  </th><th> Data </th></tr>";
    
    document.getElementById( "cache-table" ).style.display = "table";
    document.getElementById( "no-cache"    ).style.display = "none";

    for(let i = 0; i < myCache.num_linhas; i++)
    {
        body.appendChild( newCacheLine(i) );
    }
}

function setLang(lang)
{
    currentLanguage = lang;
    generateInfoTable(lang);

    if(lang === "portuguese")
    {
        document.getElementById("portuguese").className = "switch-left-active";
        document.getElementById("english")   .className = "switch-right-inactive";
    }
    else
    {
        document.getElementById("portuguese").className = "switch-left-inactive";
        document.getElementById("english")   .className = "switch-right-active";
    }

    Object.keys(text[lang]).forEach(key => {
        Array.from(document.getElementsByClassName(key)).forEach(element => {
            element.innerHTML = text[lang][key];
        }) 
    });

    document.getElementById("code").placeholder = text[lang]["codeplaceholder"];
    document.getElementById("input").placeholder = text[lang]["inputplaceholder"];
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
    
    let inputTerminal = document.getElementById('input');
    if (currentCode == "add2")
    {
        inputTerminal.value = "2 2";
    }
    if (currentCode == "countdown")
    {
        inputTerminal.value = "5";
    }
    if (currentCode == "sort3")
    {
        inputTerminal.value = "250 150 50";
    }
    if (currentCode == "custom")
    {
        inputTerminal.value = "";
    }
}

document.getElementById('code').addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const startPos = this.selectionStart;
    const endPos = this.selectionEnd;
    const value = this.value;
    this.value = value.substring(0, startPos) + '\t' + value.substring(endPos);
    this.selectionStart = this.selectionEnd = startPos + 1;
  }
});

const consoleElement = document.getElementById("console");
const consoleResize = document.getElementById("console-resize");

let resizing = false;
let lastMouseY;

function initResize(e) {
    resizing = true;
    lastMouseY = e.clientY;
    window.addEventListener('mousemove', Resize, false);
    window.addEventListener('mouseup', stopResize, false);
}

function Resize(e) {
    if (!resizing) return;

    requestAnimationFrame(() => {
        let deltaY = e.clientY - lastMouseY;
        
        const terminal = document.getElementById("terminal")
        
        if(deltaY < 0)
        {
            deltaY = Math.abs(deltaY) > terminal.offsetHeight ? 0 : deltaY;
        }
        
        let newHeight = parseInt(getComputedStyle(consoleElement).height) - deltaY;

        const terminalElement = document.getElementById("console");

        consoleElement.style.height = `${newHeight}px`;
        lastMouseY = e.clientY;
    });
}

function stopResize(e) {
    resizing = false;
    window.removeEventListener('mousemove', Resize, false);
    window.removeEventListener('mouseup', stopResize, false);
}

consoleResize.addEventListener('mousedown', initResize, false);

setClockSpeed();
generateGrid();
setLang(defaultLanguage);
