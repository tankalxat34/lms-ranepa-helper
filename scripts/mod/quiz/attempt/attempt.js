
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
        answerButtonDiv.id = "helper-operate-answer";
        answerButtonDiv.classList = "helper-operate-answer";

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
 * Заполняет тест кнопками ChatGPT
 */
function fillChatGPTButtons(openai_model_name, user_object_from_options) {
    // var CHATGPT_USER_OBJECT = JSON.parse(document.querySelector("#helper-chatgpt-user_object").value);
    var CHATGPT_USER_OBJECT = user_object_from_options;
    let QUESTIONS_NODES = document.querySelectorAll(".formulation.clearfix");
    for (let i = 0; i < QUESTIONS_NODES.length; i++) {

        // добавление поля для ответа
        let div_gpt_response = document.createElement("div");
        div_gpt_response.id = `helper-gpt_response-${i}`;
        QUESTIONS_NODES[i].appendChild(div_gpt_response);


        // добавление кнопок
        let text_arr = QUESTIONS_NODES[i].innerText.split("\n");
        text_arr.length -= 2;
        let qtext = text_arr.join("\n");

        let btn = document.createElement("a");
        btn.classList = "helper-chatgpt_question_button btn";
        btn.style.margin = "5px";
        btn.style.backgroundColor = "#75A99C";
        btn.style.color = "white";
        btn.innerHTML = `<img src="https://raw.githubusercontent.com/tankalxat34/lms-ranepa-helper/main/openai.png" alt="ChatGPT" width="24px" style="border-radius: 5px;"> ChatGPT`;

        btn.addEventListener("click", () => {
            
            // первоначальная настройка нейронной сети
            let local_ChatGPT = Object.assign({}, ChatGPT);
            console.log(local_ChatGPT);

            local_ChatGPT.do_cleaning_after_request = true;
            local_ChatGPT.do_saving_conv = true;

            // установка языковой модели
            local_ChatGPT.model = openai_model_name;

            div_gpt_response.innerHTML = `<p style="color: grey;">Нейронная сеть думает. Пожалуйста, подождите...</p>`

            local_ChatGPT.ask(qtext)
                .then(r => {
                    console.log(r);
                    return r;
                })
                .then(function (response) {
                    console.log(local_ChatGPT);
                    try {
                        div_gpt_response.innerHTML = markdown(response.choices[0].message.content);
                    } catch (error) {
                        console.log(error);
                        div_gpt_response.innerHTML = markdown(response);
                    }
                })
                .catch(function (response) {
                    console.log(response);
                    div_gpt_response.innerHTML = markdown(`${response}`);
                })

        });
        if (document.querySelectorAll(".helper-operate-answer").length) {
            document.querySelectorAll(".helper-operate-answer")[i].appendChild(btn);
        } else {
            let div = document.createElement("div");
            div.appendChild(btn);
            document.querySelectorAll(".answer")[i].appendChild(div);
        }
    }
}


function _sendToChat() {
    // отрисовываем сообщение в чате
    ChatCore.add();

    // отправляем запрос в ChatGPT
    ChatGPT.ask(document.querySelector("#helper-chatgpt_input").value, true)
        .then(function (response) {
            try {
                // отрисовываем сообщение от бота
                ChatCore.add(response.choices[0].message);
            } catch (error) {
                // если ошибка в выполнении функции - пишем сообщение об ошибке
                console.log(error);
                ChatCore.add(response);
            }
        })
        .catch(function (response) {
            // если ошибка на сервере - пишем сообщение об ошибке
            console.log(response);
            ChatCore.add(`${response}`);
        })
}


function addListenersToChat() {

    document.querySelector("#helper-chatgpt-btn_clear_conv").addEventListener("click", () => {
        ChatCore.chatgpt_object.clear_conversation();
        showAlert(`Контекст беседы был очищен!`, `warning`);
    })

    document.querySelector("#helper-btn-chatgpt_send").addEventListener("click", () => {
        _sendToChat();
    })

    document.querySelector("#helper-chatgpt_input").addEventListener("input", () => {
        document.querySelector("#helper-chatgpt_input").style.height = "auto";
        document.querySelector("#helper-chatgpt_input").style.height = document.querySelector("#helper-chatgpt_input").scrollHeight + "px";
    })

    document.querySelector("#helper-btn-chatgpt_export").addEventListener("click", () => {
        downloadFileFromText(`ChatGPT ${document.querySelector(".page-header-headings > h1").textContent} ${new Date().toLocaleString()}.html`, `<!-- Generated automatically using the LMS RANEPA HELPER extension (c) tankalxat34 -->\n\n<h3>${document.querySelector(".page-header-headings > h1").textContent}</h3>` + document.querySelector("#helper-chatgpt_response").innerHTML)
    })

    document.querySelector("#helper-chatgpt_div_input").addEventListener("keyup", (event) => {
        if (event.ctrlKey && event.key === "Enter") {
            _sendToChat();
        }
    })
}


function main() {
    
    let mainBlock = document.createElement("div")
    mainBlock.classList = "col-12 pt-3 pb-3";

    fetch(chrome.runtime.getURL("nodes/mod/quiz/attempt/mainBlock.html"))
        .then(res => res.text())
        .then(html => {
            mainBlock.innerHTML = html;
            document.getElementById("page-header").append(mainBlock);
        })
        .then(() => {
            // get option names from Chrome Storage
            chrome.storage.sync.get(["_option_names_array", "chatgpt_access_token", "chatgpt_user_object", "helper-chatgpt-model"], (options) => {

                var _opt_names = options["_option_names_array"];
                var chatgpt_user_object = JSON.parse(options["chatgpt_user_object"])

                console.log(chatgpt_user_object);

                // первоначальная настройка нейронной сети
                ChatGPT.uo = chatgpt_user_object;

                // установка языковой модели
                ChatGPT.model = options["helper-chatgpt-model"];


                // load all options from Chrome Storage
                chrome.storage.sync.get(_opt_names, (options) => {

                    if (options["helper-settings-show_operate_btns_block"]) {
                        document.querySelector("#helper-settings-show_operate_btns_block").hidden = false;
                    }

                    if (options["helper-settings-show_btns_quick_question"]) {
                        fillButtons();
                    }

                    if (options["helper-settings-show_chatgpt"]) {
                        fillChatGPTButtons(options["helper-chatgpt-model"] || "gpt-3.5-turbo", chatgpt_user_object);
                        addListenersToChat();
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