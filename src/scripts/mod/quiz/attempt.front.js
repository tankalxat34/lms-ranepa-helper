
/**
 * Переменная для хранения диалога с ботом. При каждом запросе к нейросети отправляется вместе с запросом, чтобы обеспечить сохранение контекста беседы. Начало беседы может быть удалено, чтобы освободить место для хранения токенов.
 */
var CONVERSATION = new Array();

/**
 * Переменная для хранения всего диалога с ботом. Никуда не отправляется, используется для копирования сообщений. Элементы в этом массиве никогда не удялаются.
 */
var FULL_CONVERSATION = new Array();

function clearResponseForm() {
    /*
        Очищает всю форму
    */
    document.querySelector(M.mod_quiz.autosave.SELECTORS.QUIZ_FORM).reset()


    for (let clearBtn of document.querySelectorAll("a[class='btn btn-link ml-3 mt-n1 mb-n1']")) {
        // для старого интерфейса СДО
        clearBtn.click()
    }

    for (let clearBtn of document.querySelectorAll('a[role="button"][href="#"][tabindex="0"]')) {
        // для нового интерфейса СДО, более универсальный
        clearBtn.click()
    }

    for (const entry of new FormData(document.querySelector(M.mod_quiz.autosave.SELECTORS.QUIZ_FORM))) {

        let name = entry[0]
        let value = entry[1]


        if (name.slice(0, 1) === "q" && "0123456789".includes(name.slice(1, 2)) && !name.includes("sequencecheck")) {
            // console.log(name, value)
            // console.log(document.querySelector(`input[type='checkbox'][name='${name}']`))
            try {
                document.querySelector(`input[name='${name}']`).checked = false
            } catch {
                null;
            }
        }
    }
}


function getQuestionNumber(selector) {
    return new Number(regex_findall(/[\:](\d+)[\_]/gm, selector)[1]);
}


var HelperMainQuiz = {
    
    _get_q_number: function () {
        let form = new FormData(document.querySelector(M.mod_quiz.autosave.SELECTORS.QUIZ_FORM));
        return new String(form.entries().next().value).split(":")[0].slice(1);
    },
    
    /**
     * Вернуть форму квиза в ее текущем состоянии
     * @returns Объект FormData
     */
    getPlainForm: function () {return new FormData(document.querySelector(M.mod_quiz.autosave.SELECTORS.QUIZ_FORM))},
    
    /**
     * Возвращает первую часть селектора любого ответа на странице
     * @returns Строка-часть общего селектора любых инпутов на странице
     */
    getSelectorPart: function () {
        return `q${this._get_q_number()}:`;
    },

    /**
     * Вернуть объект с данными формы 
     */
    _getForm: function () {
        var resultObject = new Object();
        let form = new FormData(document.querySelector(M.mod_quiz.autosave.SELECTORS.QUIZ_FORM));

        for (const entry of form) {
            if (!entry[0].includes("sequencecheck") && entry[0].includes(":")) {

                let selector = entry[0].split(":")[1];
                let value = entry[1];
                resultObject[selector] = value;
            }
        }
        return resultObject;
    },

    /**
     * Вернуть массив, содержащий тексты вопросов в квизе. Текст энкодируется в base64
     */
    _getQuestions: function () {
        let result = new Array();
        let div_qtexts = document.querySelectorAll(".qtext");
        // let div_legends = document.querySelectorAll("fieldset.no-overflow > legend");
        // let div_answers = document.querySelectorAll("fieldset.no-overflow > div.answer");

        for (let index = 0; index < div_qtexts.length; index++) {

            const div_qtext = div_qtexts[index];
            // const div_legend = div_legends[index];
            // const div_answer = div_answers[index];

            // result.push(div_qtext.textContent + "\n\n" + div_legend.textContent + "\n\n" + div_answer.textContent);
            // result.push(div_qtext.textContent);
            // result.push(div_qtext.innerText);
            result.push(Base64.encode(div_qtext.innerText));
        }

        return result;
    },

    /**
    * Функция возвращает объект, ключами которого является Текст вопроса, а значениями - другие объекты
    * 
    * Квиз (проблема → решение):
    * - перемешивает вопросы местами → надо шифровать тексты вопросов и варианты ответов в base64 для точной идентификации каждого из них при дешифровке
    */
    object: function (encode = true) {
        let form    = this._getForm();
        let form_keys   = new Array(...Object.keys(form));
        let form_values   = new Array(...Object.values(form));
        let q_number    = this._get_q_number();

        let result = {};

        let div_qtexts      = [...document.querySelectorAll(".qtext")].map(value => value.innerText);
        let div_legends     = [...document.querySelectorAll("fieldset.no-overflow > legend")].map(value => value.innerText);
        let div_answers     = [...document.querySelectorAll("fieldset.no-overflow > div.answer")];

        for (let index = 0; index < div_qtexts.length; index++) {
            let q = encode ? Base64.encode(div_qtexts[index]) : div_qtexts[index];
            let l = encode ? Base64.encode(div_legends[index]) : div_legends[index];
            let a = [...div_answers[index].childNodes].filter(function(value) {
                return value.tagName === "DIV"
            });
            
            result[q] = {
                legend: l,
                answers: {}
            }

            a.forEach((value, index) => {
                let childNodes = [...value.childNodes];
                
                childNodes.forEach(childElement => {
                    if (childElement.tagName === "INPUT" && childElement.getAttribute("type").toLowerCase() !== "hidden") {
                        result[q].answers[encode ? Base64.encode(value.innerText) : value.innerText] = {
                            value: childElement?.value,
                            checked: childElement?.checked
                        }
                    }
                })
            })
        }
        return result;
    }
}



/**
 * Функция экспортирует ответы на тест
 * 
 * Pull request: https://github.com/tankalxat34/lms-ranepa-helper/pull/1
 */
function exportAnswers() {
    if (window.location.href.includes("mod/quiz/attempt.php")) {
        let quizheader = document.querySelector("#page-header > div.w-100 > div.d-flex.align-items-center > div.mr-auto > div > div.page-header-headings > h1").innerText;

        downloadFileFromText(`${quizheader} попытка ${HelperMainQuiz.getPlainForm().get("attempt")} (${new Date().getTime()}).json`, JSON.stringify(HelperMainQuiz.object()));

    } else {
        showAlert("Здесь нет ответов для экспорта! Перейдите в тест, чтобы экспортировать ответы", "warning");
    }
}



function importAnswers_Handler(json_object) {

    // проверка на то, на какой странице находится пользователь
    // if (document.querySelector("input[name='thispage']").value === json_object.thispage) {

    // Очищаем форму
    clearResponseForm()

    let div_qtexts      = [...document.querySelectorAll(".qtext")].map(value => value.innerText);
    let div_legends     = [...document.querySelectorAll("fieldset.no-overflow > legend")].map(value => value.innerText);
    let div_answers     = [...document.querySelectorAll("fieldset.no-overflow > div.answer")];

    for (let index = 0; index < div_qtexts.length; index++) {
        let a = [...div_answers[index].childNodes].filter(function(value) {
            return value.tagName === "DIV"
        });

        a.forEach(value => {
            let childNodes = [...value.childNodes];

            childNodes.forEach(childElement => {
                if (childElement.tagName === "INPUT" && childElement.getAttribute("type").toLowerCase() !== "hidden") {
                    childElement.checked = json_object[Base64.encode(div_qtexts[index])].answers[Base64.encode(value.innerText)].checked;
                    if (childElement.value !== json_object[Base64.encode(div_qtexts[index])].answers[Base64.encode(value.innerText)].value) childElement.value = json_object[Base64.encode(div_qtexts[index])].answers[Base64.encode(value.innerText)].value;
                }
            })

        })
    }

    showAlert(`<p>Ответы успешно импортированы!</p><p><span style="color: red;">Перед отправкой не забудьте ВНИМАТЕЛЬНО проверить проставленные ответы!</span></p>`)

}


function importAnswers(e) {

    // getting a hold of the file reference
    let file = e.target.files[0];

    // setting up the reader
    try {
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => importAnswers_Handler(JSON.parse(readerEvent.target.result))
    } catch {
        showAlert(`Импорт ответов отменен`, "warning")
    }
    document.querySelector("#helper-btn-import_answers").value = ""
}

/**
 * Копирует текст сообщения в буфер обмена 
 */
function copyGPTMessage(index) {
    navigator.clipboard.writeText(FULL_CONVERSATION[index].content.trim());
}

/**
 * Удаляет указанное количество сообщений из начала диалога.
 * @param {*} count количество сообщений, которое будет удалено. Удаляются сообщения в начале диалога
 */
function deleteMessagesGPTConversation(count) {
    for (let index = 0; index < count; index++) {
        CONVERSATION.shift()
    }
}

// entrypoint
window.onload = () => {
    $('#helper-btn-import_answers').on('change', function (e) { importAnswers(e) })

    document.querySelector(".submitbtns").innerHTML += ` <a id="helper-btn-export_answers-2" href="#" class="btn btn-secondary" onclick="exportAnswers()"><i class="fa fa-download"></i> Экспорт в JSON</a>`

    globalThis.addEventListener("keypress", (event) => {
        if (event.shiftKey && event.ctrlKey && event.code === "KeyS") {
            M.mod_quiz.autosave.save_changes();
            showAlert("Ответы успешно сохранены в Moodle!");
        }

        if (event.shiftKey && event.ctrlKey && event.code === "KeyE") {
            exportAnswers();
        }

        if (event.shiftKey && event.ctrlKey && event.code === "KeyR") {
            M.mod_quiz.autosave.save_changes();
            window.location.reload();
            showAlert("Ответы успешно сохранены в Moodle, страница перезагружается...");
        }
    })

}

