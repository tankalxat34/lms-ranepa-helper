
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


/**
 * Функция возвращает массив объектов вида `{qtext: "текст вопроса", legend: "подпись и номер вопроса", answers: [someObject1, someObject2]}`
 */
function getQuestions() {
    let result = new Array();
    
    let div_qtexts = document.querySelectorAll(".qtext");
    let div_legends = document.querySelectorAll("fieldset.no-overflow > legend");
    let div_answers = document.querySelectorAll("fieldset.no-overflow > div.answer");

    for (let index = 0; index < div_qtexts.length; index++) {
        const div_qtext = div_qtexts[index];
        const div_legend = div_legends[index];
        const div_answer = div_answers[index];
        
        let o = new Object();
        o.qtext     = div_qtext.textContent;
        o.legend    = div_legend.textContent;
        o.answers   = new Array();
        for (const answer_node of div_answer.childNodes) {
            let local_o = new Object();

            console.log(answer_node.checked);

            // Сохраняем текст вопроса
            let t = answer_node.textContent.trim();
            if (t) {
                local_o.atext = t
                /**
                 * Всегда будет поле status! Но итоговое значение в нем будет определяться автоматически
                 * 
                 * Есть два поля у разных инпутов - checked и value. Второе поле есть даже у тех инпутов,
                 * которые не отмечены. Можно проверять value на содержание букв и если в value букв нет
                 * - то перед нами чекбокс/радио или что то другое.
                 * 
                 * Надо определить, что брать - первый или второй атрибут
                 * 
                 * -------------------------------------------
                 * 
                 * Новая идея
                 * 
                 * Брать результат с формы (когда нажимаешь submit)
                 * И по номерам вопросов распределять ответы. Так можно не париться с тегами!
                 * 
                 * Например так:
                 * 
                for (const entry of new FormData(document.querySelector(M.mod_quiz.autosave.SELECTORS.QUIZ_FORM))) {
                    console.log(entry);
                }

                или

                for (const entry of new FormData(document.querySelector(M.mod_quiz.autosave.SELECTORS.QUIZ_FORM))) {
                    if (!entry[0].includes("sequencecheck")) console.log(entry);
                }

                 *
                 *
                 */
                local_o.checked     = answer_node.childNodes[0].checked;
                local_o.value       = answer_node.childNodes[0].value;
                local_o.tagName     = answer_node.childNodes[0].tagName;
                local_o.nodeName    = answer_node.childNodes[0].nodeName;
                local_o.type        = answer_node.childNodes[0].type;
                o.answers.push(local_o);
            };

        }
        result.push(o);
    }
    return result;
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

        for (const div of div_questions) {
            if (div.textContent) {
                console.log(div.textContent);
                result[div.textContent] = new Object();
            }
        }


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

