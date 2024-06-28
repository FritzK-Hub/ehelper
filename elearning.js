const color_green = "#59bb59";
const color_table_odd = "#eeeeee";
const color_table_even = "#ffffff"



if (true) {
    let debugQuestionElement = document.querySelectorAll(`[id^='question-']`);
    for (let i = 0; i < debugQuestionElement.length; i++) {
        let questionNumberElement = document.createElement("p");
        let questionNumberText = debugQuestionElement[i].id;
        questionNumberText = questionNumberText.substring(questionNumberText.lastIndexOf('-')+1);
        questionNumberElement.innerHTML = `<h1 style='text-align: center;'><b>${questionNumberText}</b></h1>`;
        let found = false;
        for (let j = 0; j < debugQuestionElement.length; j++) {
            if (debugQuestionElement[j].lastChild.innerHTML === questionNumberElement.innerHTML) {
                found = true;
            }
        }
        if (!found) debugQuestionElement[i].appendChild(questionNumberElement);
    }
}

let footerElement = document.getElementsByTagName("footer")[0];
if (footerElement) footerElement.remove();
let footeractivityElement = document.getElementById("prev-activity-link");
if (footeractivityElement) footeractivityElement.remove();


let testNameObj = JSON.parse(testNameJson);
testNameObj.tests.forEach(obj => {
    let hasIdstring = (obj.hasOwnProperty("idstring")) 
    let precontext = findElementByText(obj.domType, obj.name, document, null);
    if (hasIdstring) {
        if (precontext) {
            let context = findElementByText(obj.domType, obj.idstring, document, null);
            if (context) findQuestionContext(testArr[obj.id], (obj.hasOwnProperty("compound")));
        }
    } else {
        if (precontext) findQuestionContext(testArr[obj.id], (obj.hasOwnProperty("compound")));
    }
}); 



function findElementByText(type, textToFind, context, notContains){
    let xpath = "";
    if (!notContains) {
        xpath = `.//${type}[contains(text(),'${textToFind}')]`; 
    } else {
        xpath = `.//${type}[contains(text(),'${textToFind}') and not(contains(text(),'${notContains}'))]`; 
    }
    return document.evaluate(xpath, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function findQuestionContext(questionJson, compound){
    let questionObj = JSON.parse(questionJson);
    if (compound) {
        questionObj.questions.forEach(obj => {
            let questionElementList = document.querySelectorAll(`[id^='question-']`);
            for (let i = 0; i < questionElementList.length; i++) {
                if (questionElementList[i].classList.contains("que")) {
                    if (obj.hasOwnProperty("andQText")){
                        let questionElement = findElementByText(obj.qDomType, obj.qText, questionElementList[i], null);
                        let andQuestionElement = findElementByText(obj.andDomType, obj.andQText, questionElementList[i], null);
                        if (questionElement && andQuestionElement) {
                            injectAnswer(questionElementList[i], obj);
                        }
                    } else {
                        let questionElement = findElementByText(obj.qDomType, obj.qText, questionElementList[i], null);
                        if (questionElement) {
                            injectAnswer(questionElementList[i], obj);
                        }
                    }
                }
            }
        });
    } else {
        questionObj.questions.forEach(obj => {
            let questionElement = document.querySelectorAll(`[id^='question-'][id$='-${obj.qId}']`);
            if (questionElement.length > 0) {
                injectAnswer(questionElement[0], obj);
            }
        });
    }
}


function injectAnswer(questionElement, questionObj){
    switch (questionObj.type) {
        case "border":
                borderAnswer(questionElement, questionObj); 
            break;
        case "append":
                appendAnswer(questionElement, questionObj)
            break;
        default:
            break;
    }
}

function borderAnswer(questionElement, questionObj) {
    questionObj.answer.forEach((answerStr, index) => {
        let exact = (questionObj.hasOwnProperty("exact")) 
        let answerElement = null;
        if (exact && index == questionObj.exact) {
            answerElement = findElementByText(questionObj.domType, answerStr[0], questionElement, answerStr[1]);
        } else {
            answerElement = findElementByText(questionObj.domType, answerStr, questionElement, null);
        }
        if (answerElement) {
            answerElement.style.border = `3px solid ${color_green}`;
            answerElement.style.padding = "5px"
            answerElement.style.borderRadius = "8px"
        }
    });
}

function appendAnswer(questionElement, questionObj) {
    let table = createTable();
    questionObj.answer.forEach((row, index) => {
        let table_row = createTableRow(index);
        row.forEach(cellText => {
            table_row.appendChild(createTableCell(cellText));
        });
        table.appendChild(table_row);
    });

    questionElement.getElementsByClassName("formulation clearfix")[0].appendChild(table);
    }


function createTableCell(text) {
    let row_cell = document.createElement("td");
    let cell_text = document.createElement("p");
    cell_text.innerHTML = text;
    row_cell.appendChild(cell_text);
    row_cell.style.padding = "6px 15px 3px 6px";
    row_cell.style.border = `1px solid lightgray`;
    return row_cell;
}

function createTableRow(index) {
        let table_row = document.createElement("tr");
        table_row.style.backgroundColor 
            = (index % 2 == 0) 
            ? color_table_even 
            : color_table_odd;
        return table_row;
}

function createTable() {
    let table = document.createElement("table");
    table.style.border = `3px solid ${color_green}`;
    table.style.borderCollapse = "separate";
    table.style.borderRadius = "8px"
    table.style.borderSpacing = 0;
    return table;
}