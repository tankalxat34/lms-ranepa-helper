
const INTERNET_PATTERNS = {
    yandex: {
        url: "https://yandex.ru/search/?text=",
        replacedSpace: "+",
        name: "Яндекс"
    },
    google: {
        // url: "https://www.google.ru/search?ie=UTF-8&q=",
        url: "https://www.google.ru/search?q=",
        replacedSpace: " ",
        name: "Google"
    },
    mailru: {
        url: "https://go.mail.ru/search?mailru=1&q=",
        replacedSpace: " ",
        name: "Mail.ru"
    },
    brave: {
        url: "https://search.brave.com/search?q=",
        replacedSpace: "+",
        name: "Brave"
    },
    bing: {
        url: "https://www.bing.com/search?q=",
        replacedSpace: "+",
        name: "Bing"
    },
    nigma: {
        url: "https://xn--80aforc.xn--p1acf/index.php?query=",
        replacedSpace: "+",
        name: "Нигма"
    }
}

const USER = {
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
}


function getQuestions(qtext) {
    /* 
        Возвращает список всех вопросов на странице
    */

    let questionNodes = document.querySelectorAll("div.qtext")

    let answersArray = new Array();

    for (let i = 0; i < questionNodes.length; i++) {
        let questionText = questionNodes[i].innerText;
        // if (questionNodes[i].childNodes[0].nodeName !== "#text") {
        //     questionText = questionNodes[i].childNodes[0].innerText;
        // }
        answersArray.push(questionText.replaceAll("\n", " ").replaceAll("  ", " "));
    }

    return Object.assign(answersArray)
}




function fillButtons(qtext = ".qtext") {
    /* 
        Заполняет блоки с вопросами кнопками с поисковыми системами 
    */

    let questionTexts = getQuestions(qtext);

    let answerNodes = document.getElementsByClassName("answer");

    var questionIndex = 0
    for (let answerNode of answerNodes) {

        let answerButtonDiv = document.createElement("div");
        answerButtonDiv.id = "helper-operate-answer"
        // answerButtonDiv.innerHTML += `<h5>Поиск вопроса</h5>`
        // answerButtonDiv.style.marginTop = "5px";

        var questionText = questionTexts[questionIndex];

        for (let system of Object.keys(INTERNET_PATTERNS)) {

            let button = document.createElement("a");
            button.classList = "btn btn-secondary";
            button.style.margin = "5px 5px";
            button.target = "_blank";

            button.href = INTERNET_PATTERNS[system].url + questionText.replaceAll(" ", INTERNET_PATTERNS[system].replacedSpace);
            button.innerText = INTERNET_PATTERNS[system].name;

            answerButtonDiv.appendChild(button);
        }
        answerNode.appendChild(answerButtonDiv);

        questionIndex++;
    }
}



/**
 *  Добавляет блок для управления тестом
// */
// function addMainBlock() {
//     let mainBlock = document.createElement("div")
//     mainBlock.classList = "col-12 pt-3 pb-3"

//     return fetch(chrome.runtime.getURL("nodes/mod/quiz/attempt/mainBlock.html"))
//         .then(res => res.text())
//         .then(html => {
//             mainBlock.innerHTML = html;
//             document.getElementById("page-header").append(mainBlock)
//         })
// }



class MyChatGPT {}




function main() {
    fillButtons();

    let mainBlock = document.createElement("div")
    mainBlock.classList = "col-12 pt-3 pb-3"

    fetch(chrome.runtime.getURL("nodes/mod/quiz/attempt/mainBlock.html"))
        .then(res => res.text())
        .then(html => {
            mainBlock.innerHTML = html;
            document.getElementById("page-header").append(mainBlock);
        })
        .then(() => {
            // get option names from Chrome Storage
            chrome.storage.sync.get(["_option_names_array"], (options) => {
        
                var _opt_names = options["_option_names_array"];
        
                // load all options from Chrome Storage
                chrome.storage.sync.get(_opt_names, (options) => {
        
                    if (options["helper-settings-show_chatgpt"]) {
                        document.querySelector("#helper-settings-show_chatgpt").hidden = false;
                    }

                    if (options["helper-settings-show_hidden_inputs"]) {
                        let hidden_inputs = document.querySelectorAll("input[type='hidden']")
                        for (let inp of hidden_inputs) {
                            inp.type = "text";
                        }
                    };
        
                    if (options["helper-settings-changeable_form_action"]) {

                        const default_formaction = document.querySelector("#responseform").action;

                        let form_action_input = document.querySelector("#helper-settings-changeable_form_action-input");

                        document.querySelector("#helper-settings-changeable_form_action").hidden = false;
                        form_action_input.placeholder = document.querySelector("#responseform").action;
                        
                        form_action_input.addEventListener("keyup", () => {
                            document.querySelector("#responseform").action = form_action_input.value;

                            if (form_action_input.value === "") document.querySelector("#responseform").action = default_formaction;
                        })
                    }
                })
        })

    })


}

main();