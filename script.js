const NOFILE = 'Ninguno',
    txtArea = document.getElementById('txtContent'),
    txtKeyWordsCount = document.getElementById('keywordCount'),
    txtIdentificadoresCount = document.getElementById('identificadoresCount'),
    txtOpsRelacionalesCount = document.getElementById('opsRelacionalesCount'),
    txtOpsLogicosCount = document.getElementById('opsLogicosCount'),
    txtOpsAritmeticosCount = document.getElementById('opsAritmeticosCount'),
    txtAsignacionesCount = document.getElementById('asignacionesCount'),
    txtEnterosCount = document.getElementById('enterosCount'),
    txtDecimalesCount = document.getElementById('decimalesCount'),
    txtStringCount = document.getElementById('stringCount'),
    txtComMultiCount = document.getElementById('comMultiCount'),
    txtComLineaCount = document.getElementById('comLineaCount'),
    txtParentesisCount = document.getElementById('parentesisCount'),
    txtLlavesCount = document.getElementById('llavesCount'),
    txtErrorsCount = document.getElementById('errorCount');
let preparedText = [],
    palabras_reservadas = 0,
    identificadores = 0,
    ops_relacionales = 0,
    ops_logicos = 0,
    ops_aritmeticos = 0,
    asignaciones = 0,
    nums_enteros = 0,
    nums_decimales = 0,
    cadena_chars = 0,
    comentarios_multi = 0,
    comentarios_linea = 0,
    parentesis = 0,
    llaves = 0,
    errors = 0,
    acumulateWord = [];

// STATE FUNCTIONS
const checkFinish = (charIndex) => {
    return charIndex >= preparedText.length;
}

const keywordValidator = () => {
    const keyWords = ['if', 'else', 'switch', 'case', 'default', 'for', 'while', 'break', 'int', 'string', 'double', 'char', 'print'];

    if (keyWords.includes(acumulateWord.join('').toLowerCase()))
        palabras_reservadas++; // Contamos palabra reservada
    else
        identificadores++; // Contamos identificador

    acumulateWord = [];
}

const state_start = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
        case '\t':
            state_start(++charIndex);
            break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            state_num(++charIndex);
            break;
        case '-':
            state_menos(++charIndex);
            break;
        case '<':
            state_menor(++charIndex);
            break;
        case '>':
            state_mayor(++charIndex);
            break;
        case '!':
            state_admi(++charIndex);
            break;
        case '=':
            state_igual(++charIndex);
            break;
        case '&':
            state_gato(++charIndex);
            break;
        case '|':
            state_linea(++charIndex);
            break;
        case '/':
            state_diag(++charIndex);
            break;
        case '+':
            state_mas(++charIndex);
            break;
        case '%':
            state_porcentaje(++charIndex);
            break;
        case '*':
            state_por(++charIndex);
            break;
        case '"':
            state_comilla(++charIndex);
            break;
        case '(':
        case ')':
            state_parentesis(++charIndex);
            break;
        case '{':
        case '}':
            state_llaves(++charIndex);
            break;
        default:
            acumulateWord.push(preparedText[charIndex]);
            state_letras(++charIndex);
    }
};

const state_num = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            nums_enteros++; // Contamos num_entero
            state_start(++charIndex);
            break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            state_num(++charIndex);
            break;
        case '.':
            state_num2(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_num2 = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            state_start(++charIndex);
            break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            state_deci(++charIndex);
            break;
        default:
            errors++; // Contamos error;
            state_error(++charIndex);
    }
}

const state_deci = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            nums_decimales++; // Contamos num_decimal
            state_start(++charIndex);
            break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            state_deci(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
}

const state_menos = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
            ops_aritmeticos++; // Contamos op_aritmetico
            state_start(++charIndex);
            break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            state_num(++charIndex);
            break;
        case '\n':
            errors++; // Contamos error y reiniciamos
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_menor = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            ops_relacionales++; // Contamos op_relacional
            state_start(++charIndex);
            break;
        case '=':
            state_dosIgual(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_mayor = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            ops_relacionales++; // Contamos op_relacional
            state_start(++charIndex);
            break;
        case '=':
            state_dosIgual(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_admi = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            ops_logicos++; // Contamos op_logico
            state_start(++charIndex);
            break;
        case '=':
            state_dosIgual(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_igual = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            asignaciones++; // Contamos asignacion
            state_start(++charIndex);
            break;
        case '=':
            state_dosIgual(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_dosIgual = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            ops_relacionales++; // Contamos op_relacional
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_gato = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            state_start(++charIndex);
            break;
        case '&':
            state_gato2(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_gato2 = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            ops_logicos++; // Contamos op_logico
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_linea = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            state_start(++charIndex);
            break;
        case '|':
            state_linea2(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_linea2 = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            ops_logicos++; // Contamos op_logico
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_diag = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
            ops_aritmeticos++; // Contamos op_aritmetico
            state_start(++charIndex);
            break;
        case '*':
            state_diagAste(++charIndex);
            break;
        case '/':
            state_diag2(++charIndex);
            break;
        case '\n':
            errors++; // Contamos error y reiniciamos
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_diag2 = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            comentarios_linea++; // Contamos comentario_linea hola
            state_start(++charIndex);
            break;
        default:
            state_diag2(++charIndex);
    }
};

const state_diagAste = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case '\n':
            errors++; // Contamos error y reiniciamos
            state_start(++charIndex);
            break;
        case ' ':
            errors++; // Contamos error
            state_error(++charIndex);
            break;
        case '*':
            state_aste(++charIndex);
            break;
        default:
            state_diagAste(++charIndex);
    }
};

const state_aste = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case '\n':
            errors++; // Contamos error y reiniciamos
            state_start(++charIndex);
        case ' ':
            errors++; // Contamos error
            state_error(++charIndex);
            break;
        case '/':
            state_asteDiag(++charIndex);
            break;
        default:
            state_diagAste(++charIndex);
    }
};

const state_asteDiag = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            comentarios_multi++; // Contamos comentario_multi
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_mas = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
            ops_aritmeticos++; // Contamos op_aritmetico
            state_start(++charIndex);
            break;
        case '\n':
            errors++; // Contamos error y reiniciamos
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_porcentaje = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
            ops_aritmeticos++; // Contamos op_aritmetico
            state_start(++charIndex);
            break;
        case '\n':
            errors++; // Contamos error y reiniciamos
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_por = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
            ops_aritmeticos++; // Contamos op_aritmetico
            state_start(++charIndex);
            break;
        case '\n':
            errors++; // Contamos error y reiniciamos
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_comilla = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
            errors++; // Contamos error
            state_error(++charIndex);
            break;
        case '"':
            state_comillas(++charIndex);
            break;
        case "\n":
            errors++; // Contamos error y reiniciamos
            state_start(++charIndex);
            break;
        default:
            state_comilla(++charIndex);
    }
};

const state_comillas = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            cadena_chars++; // Contamos cadena_chars
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_parentesis = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            parentesis++; // Contamos parentesis
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_llaves = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            llaves++; // Contamos llaves
            state_start(++charIndex);
            break;
        default:
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_letras = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            keywordValidator();
            state_start(++charIndex);
            break;
        case 'a':
        case 'b':
        case 'c':
        case 'd':
        case 'e':
        case 'f':
        case 'g':
        case 'h':
        case 'i':
        case 'j':
        case 'k':
        case 'l':
        case 'm':
        case 'n':
        case 'o':
        case 'p':
        case 'q':
        case 'r':
        case 's':
        case 't':
        case 'u':
        case 'v':
        case 'w':
        case 'x':
        case 'y':
        case 'z':
        case '_':
            acumulateWord.push(preparedText[charIndex]);
            state_letras(++charIndex);
            break;
        default:
            acumulateWord = [];
            errors++; // Contamos error
            state_error(++charIndex);
    }
};

const state_error = (charIndex) => {
    if (checkFinish(charIndex)) return;

    switch (preparedText[charIndex].toLowerCase()) {
        case ' ':
        case '\n':
            state_start(++charIndex);
            break;
        default:
            state_error(++charIndex);
    }
}

// GENERAL FUNCTIONS

// Clicker helper for design purposes.
const clickUpload = () => {
    document.getElementById('inputUpload').click();
};

// Update file name in the UI.
const setFileName = (file) => {
    const fileName = file.target.files.length ? file.target.files[0].name : NOFILE,
        txtFileName = document.getElementById('fileName');

    txtFileName.innerText = fileName;
};

// Read file and its content.
const readFile = (file) => {
    setFileName(file);
    txtKeyWordsCount.innerText = 0;
    txtIdentificadoresCount.innerText = 0;
    txtOpsRelacionalesCount.innerText = 0;
    txtOpsLogicosCount.innerText = 0;
    txtOpsAritmeticosCount.innerText = 0;
    txtAsignacionesCount.innerText = 0;
    txtEnterosCount.innerText = 0;
    txtDecimalesCount.innerText = 0;
    txtStringCount.innerText = 0;
    txtComMultiCount.innerText = 0;
    txtComLineaCount.innerText = 0;
    txtParentesisCount.innerText = 0;
    txtLlavesCount.innerText = 0;
    txtErrorsCount.innerText = 0;

    const fileUploaded = file.target.files[0],
        reader = new FileReader();

    if (!fileUploaded) {
        txtArea.value = '';
        return;
    }

    reader.onload = (e) => {
        const content = e.target.result;
        setText(content);
    };

    reader.readAsText(fileUploaded);
};

// Set file text in the textarea.
const setText = (fileText) => {
    txtArea.value = fileText;
};

// Pass the file text to a char array.
const prepareText = (fileText) => {
    preparedText = [];

    for (const char of fileText)
        preparedText.push(char);
}

// Count web & ebay words in whole text.
const countText = () => {
    // Restart the count.
    palabras_reservadas = 0;
    identificadores = 0;
    ops_relacionales = 0;
    ops_logicos = 0;
    ops_aritmeticos = 0;
    asignaciones = 0;
    nums_enteros = 0;
    nums_decimales = 0;
    cadena_chars = 0;
    comentarios_multi = 0;
    comentarios_linea = 0;
    parentesis = 0;
    llaves = 0;
    errors = 0;
    acumulateWord = [];

    // Prepare text
    prepareText(txtArea.value);

    // Start on the initial state.
    state_start(0);
    txtKeyWordsCount.innerText = palabras_reservadas;
    txtIdentificadoresCount.innerText = identificadores;
    txtOpsRelacionalesCount.innerText = ops_relacionales;
    txtOpsLogicosCount.innerText = ops_logicos;
    txtOpsAritmeticosCount.innerText = ops_aritmeticos;
    txtAsignacionesCount.innerText = asignaciones;
    txtEnterosCount.innerText = nums_enteros;
    txtDecimalesCount.innerText = nums_decimales;
    txtStringCount.innerText = cadena_chars;
    txtComMultiCount.innerText = comentarios_multi;
    txtComLineaCount.innerText = comentarios_linea;
    txtParentesisCount.innerText = parentesis;
    txtLlavesCount.innerText = llaves;
    txtErrorsCount.innerText = errors;

    console.log(`Palabras reservadas: ${palabras_reservadas},\nIdentificadores: ${identificadores},\nOperadores rel: ${ops_relacionales},\nOperadores log: ${ops_logicos},\nOperadores aritmeticos: ${ops_aritmeticos},\nAsignaciones: ${asignaciones},\nNumeros enteros: ${nums_enteros},\nNumeros decimales: ${nums_decimales},\nCadena de caracteres: ${cadena_chars},\nComentario multilinea: ${comentarios_multi},\nComentario de linea: ${comentarios_linea},\nParentesis: ${parentesis},\nLlaves: ${llaves},\nErrores: ${errors}\n---FIN---`);
}

// EVENTS
document.addEventListener("DOMContentLoaded", () => {
    const btnUpload = document.getElementById('uploadFile'),
        btnCount = document.getElementById('countText'),
        inputFile = document.getElementById('inputUpload');

    btnUpload.addEventListener('click', clickUpload);

    btnCount.addEventListener('click', countText);

    inputFile.addEventListener('change', readFile);
});