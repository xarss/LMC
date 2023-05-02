const commands = 
{
    english: 
    [
        {
            "command_name": "Input",
            "syntax": "INP",
            "description": "Gets an input from the input terminal. (0) if no value is passed.",
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
            "syntax": "ADD [position]",
            "description": "Adds the specified value to the accumulator.",
            "opcode": "1xx"
        },
        {
            "command_name": "Subtract",
            "syntax": "SUB [position]",
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
    ],
    portuguese: 
    [
        {
            "command_name": "Input",
            "syntax": "INP",
            "description": "Obtém uma entrada do terminal de entrada. (0) é passado caso não haja entradas suficientes.",
            "opcode": "901"
        },
        {
            "command_name": "Output",
            "syntax": "OUT",
            "description": "Exibe o valor do acumulador no terminal de saída.",
            "opcode": "902"
        },
        {
            "command_name": "Add",
            "syntax": "ADD [valor]",
            "description": "Adiciona o valor especificado ao acumulador.",
            "opcode": "1xx"
        },
        {
            "command_name": "Subtract",
            "syntax": "SUB [valor]",
            "description": "Subtrai o valor especificado do acumulador.",
            "opcode": "2xx"
        },
        {
            "command_name": "Load",
            "syntax": "LDA [endereço de memória]",
            "description": "Carrega o acumulador com o conteúdo armazenado no endereço de memória fornecido.",
            "opcode": "5xx"
        },
        {
            "command_name": "Store",
            "syntax": "STA [endereço de memória]",
            "description": "Armazena o valor do acumulador no endereço de memória fornecido.",
            "opcode": "3xx"
        },
        {
            "command_name": "Branch Always",
            "syntax": "BRA [rótulo]",
            "description": "Pula para o rótulo fornecido.",
            "opcode": "6xx"
        },
        {
            "command_name": "Branch If Positive",
            "syntax": "BRP [rótulo]",
            "description": "Pula para o rótulo fornecido se o conteúdo do acumulador for positivo.",
            "opcode": "8xx"
        },
        {
            "command_name": "Branch If Zero",
            "syntax": "BRZ [rótulo]",
            "description": "Pula para o rótulo fornecido se o conteúdo do acumulador for igual a zero.",
            "opcode": "7xx"
        },
        {
            "command_name": "Halt",
            "syntax": "HLT",
            "description": "Interrompe o código.",
            "opcode": "000"
        },
        {
            "command_name": "Data Location",
            "syntax": "DAT [nome] [valor]",
            "description": "Associa um rótulo a um endereço de memória, se fornecido um valor, ele será armazenado na memória. (valor é opcional)",
            "opcode": ""
        }
    ]
}