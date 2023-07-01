
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
 * Функция экспортирует ответы на тест
 */
function exportAnswers() {
    if (window.location.href.includes("mod/quiz/attempt.php")) {

        /**
         * Все блоки с текстами вопросов
         */
        let div_questions = document.querySelectorAll(".qtext");

        /**
         * Все блоки с вариантами ответов
         */
        let div_answer_blocks = document.querySelectorAll("fieldset > .answer");

        


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

