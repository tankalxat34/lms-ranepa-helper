
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
    * Функция возвращает массив объектов вида `{qtext: "текст вопроса", legend: "подпись и номер вопроса", answers: [someObject1, someObject2]}`
    * 
    * Квиз (проблема → решение):
    * - перемешивает вопросы местами → надо шифровать тексты вопросов и варианты ответов в base64 для точной идентификации каждого из них при дешифровке
    * - 
    * 
    */
    object: function () {
        let form    = this._getForm();
        let form_keys   = new Array(...Object.keys(form));
        let form_values   = new Array(...Object.values(form));
        let q_number    = this._get_q_number();

        let result = new Array();

        let div_qtexts = document.querySelectorAll(".qtext");
        let div_legends = document.querySelectorAll("fieldset.no-overflow > legend");
        let div_answers = document.querySelectorAll("fieldset.no-overflow > div.answer");

        var selector_index = 1;
        for (let index = 0; index < div_qtexts.length; index++) {
            const div_qtext = div_qtexts[index];
            const div_legend = div_legends[index];
            const div_answer = div_answers[index];

            let o = new Object();
            o.text = Base64.encode(div_qtext.textContent);
            o.legend = Base64.encode(div_legend.textContent);
            try {
                o.answer_status.push(form_values[selector_index - 1]);
            } catch {
                o.answer_status = new Array();
                o.answer_status.push(form_values[selector_index - 1]);
            }
            o.answers = new Array();
            let selector_index_answer = 0;
            for (const answer_node of div_answer.childNodes) {
                let local_o = new Object();

                // Сохраняем текст вопроса
                let t = answer_node.textContent.trim();
                if (t) {
                    local_o.text = Base64.encode(t);
                    
                    selector_index_answer++;
                    // local_o.checked     = answer_node.childNodes[0].checked;
                    // local_o.value       = answer_node.childNodes[0].value;
                    // local_o.tagName     = answer_node.childNodes[0].tagName;
                    // local_o.nodeName    = answer_node.childNodes[0].nodeName;
                    // local_o.type        = answer_node.childNodes[0].type;
                    o.answers.push(local_o);
                };

                
            }
            selector_index++;
            result.push(o);
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

        /**
         * Результирующий объект. Должен быть экспортирован в JSON
         */
        let result = new Object();

        /**
         * Все блоки с текстами вопросов. Это будущие ключи для нашей структуры
         */
        let div_questions = document.querySelectorAll(".qtext");

        /**
         * Все блоки с вариантами ответов
         */
        let div_answer_blocks = document.querySelectorAll("fieldset > .answer");

        /**
         * Типы вопроса (текста по типу "Выберите один вариант ответа:",
         * "Выберите один или несколько ответов:" и т.д.)
         */
        let div_answer_types = document.querySelectorAll("legend.prompt");

        /**
         * Здесь будут храниться объекты, интерпретирующие варианты ответов. Структуру смотри в pull request
         */
        let string_answer_texts = new Array();

        let quizheader = document.querySelector("#page-header > div.w-100 > div.d-flex.align-items-center > div.mr-auto > div > div.page-header-headings > h1").innerText;

        // for (const div of div_questions) {
        //     if (div.textContent) {
        //         console.log(div.textContent);
        //         result[div.textContent] = new Object();
        //     }
        // }

        downloadFileFromText(`${quizheader} попытка ${HelperMainQuiz.getPlainForm().get("attempt")} (${new Date().getTime()}).json`, JSON.stringify(HelperMainQuiz._getForm()));

    } else {
        showAlert("Здесь нет ответов для экспорта! Перейдите в тест, чтобы экспортировать ответы", "warning");
    }
}



function importAnswers_Handler(json_object) {
    /* 
        q9827138:1_answer0    
    */

    // проверка на то, на какой странице находится пользователь
    // if (document.querySelector("input[name='thispage']").value === json_object.thispage) {

    // Очищаем форму
    clearResponseForm()
    // console.log(json_object)
    for (const name of Object.keys(json_object.questions)) {

        let obj = json_object.questions[name]
        let local_selector = `input[name='${name}'][value='${obj.selected}']`
        console.log(local_selector)
        // let input = document.querySelector(obj.querySelector)
        let input = document.querySelector(local_selector)

        switch (input.type) {
            case "radio":
                input.click()
                break;

            case "checkbox":
                input.checked = false
                if (obj.selected === "1") {
                    input.checked = true
                }
                break;

            case "text":
                input.value = obj.selected
                break;

            default:
                input.value = obj.selected
                break;
        }
    }

    showAlert(`<p>Ответы из файла успешно импортированы!</p><p><span style="color: red;">Перед отправкой не забудьте ВНИМАТЕЛЬНО проверить проставленные ответы!</span></p>`)

    // } else {

    //     showAlert(`<p>Этот файл не содержит ответы для данной страницы</p><p>Ответы предназначены для страницы: ${json_object.thispage}. Текущая страница: ${document.querySelector("input[name='thispage']").value}</p>`, "warning")

    // }
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

