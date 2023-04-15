
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



function exportAnswers() {
    if (window.location.href.includes("mod/quiz/attempt.php")) {

        let exportData = new Object()
        let questionsObject = new Object()

        var _test_id = null;

        let filename = `attempt${M.cfg.sesskey}_${new Date().getTime()}.json`


        for (const entry of new FormData(document.querySelector(M.mod_quiz.autosave.SELECTORS.QUIZ_FORM))) {
            // output = entry[0] + "=" + entry[1] + "\r";

            let id = entry[0]
            let value = entry[1]

            if (id.slice(0, 1) === "q" && "0123456789".includes(id.slice(1, 2)) && !id.includes("sequencecheck")) {

                questionsObject[id] = {
                    backend_number: id.split("_")[0].split(":")[1],
                    selected: value,
                    querySelector: "0123456789".includes(id.slice(-1)) ? "#" + (id).replace(":", "\\:") : "#" + (id + value).replace(":", "\\:"),
                }

                _test_id = id.split(":")[0].slice(1)

            } else if (id !== "sesskey" && !(id.slice(0, 1) === "q" && "0123456789".includes(id.slice(1, 2)) && id.includes("sequencecheck"))) {
                exportData[id] = value
            }
        }

        exportData.test_id = _test_id
        exportData.questions = questionsObject

        showAlert("Скачанный файл вы можете отправить своим одногруппникам, у которых установлен LMS RANEPA Helper. С помощью расширения они смогут в этот тест загрузить все ответы из полученного json файла. Скачать расширение можно <a href=\"https://github.com/tankalxat34/lms-ranepa-helper\" target=\"_blank\">здесь</a>. Также можно <a href=\"https://vk.com/share.php?url=https://github.com/tankalxat34/lms-ranepa-helper\" target=\"_blank\">поделиться расширением</a>.")

        downloadFileFromText(filename, JSON.stringify(exportData, null, 4))

    } else {
        showAlert("Здесь нет ответов для экспорта! Перейдите в тест, чтобы экспортировать ответы", "warning")
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

function requestToChatGPT(content, uo, openai_model = "gpt-3.5-turbo") {
    /*
    curl https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "What is the OpenAI mission?"}] 
    }'
    */
    CONVERSATION.push({"role": "user", "content": content});
    FULL_CONVERSATION.push({"role": "user", "content": content});

    $("#helper-chatgpt_response")[0].innerHTML += `<div class="mb-4 p-3" data-message_sender="user" style="border-radius: 10px; background-color: #E2E2E2;">
    <h6>${uo.user.email} (${new Date().toLocaleTimeString()})</h6>
    ${markdown(content)}
    </div>`;
    $("#helper-chatgpt_input")[0].value = "";
    $("#helper-chatgpt_input")[0].disabled = true;
    $("#helper-btn-chatgpt_send")[0].disabled = true;

    $.ajax({
        url: 'https://api.openai.com/v1/chat/completions',
        type: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${uo.accessToken}`
        },
        data: JSON.stringify({
            model: openai_model,
            messages: CONVERSATION
        }),
        success: function (data) {
            console.log(data);
            CONVERSATION.push({"role": "assistant", "content": data.choices[0].message.content});
            FULL_CONVERSATION.push({"role": "assistant", "content": data.choices[0].message.content});
            
            let html = markdown(data.choices[0].message.content);
            $("#helper-chatgpt_input")[0].disabled = false;
            $("#helper-btn-chatgpt_send")[0].disabled = false;
            $("#helper-chatgpt_response")[0].innerHTML += `<div class="mb-4 p-3" data-message_sender="assistant" style="border-radius: 10px; background-color: #E2E2E2;">
            <h6>${data.choices[0].message.role[0] + data.choices[0].message.role.slice(1)} (${new Date().toLocaleTimeString()})</h6>
            ${html}
            <div class="buttons" style="display: flex;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg" alt="Скопировать ответ в Markdown" title="Скопировать ответ в Markdown" width=20px style="cursor: pointer;" onclick="copyGPTMessage(${CONVERSATION.length - 1})">
            </div>
            </div>`;
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseJSON);
            let resp = xhr.responseJSON.error;
            $("#helper-chatgpt_input")[0].disabled = false;
            $("#helper-btn-chatgpt_send")[0].disabled = false;

            let html_hint_tokenlimit = `<b>Совет:</b> попробуйте удалить несколько первых сообщений из беседы, чтобы продолжить общение с ботом. Контекст беседы может незначительно измениться, однако, освободив место для диалога, вы сможете продолжить общение. Удаление сообщений не скроет их из вашего диалога, не затронет возможности копирования текста или функцию экспорта всего диалога. После очистки сообщений напишите боту "продолжи" или "продолжай", чтобы получить ответ до конца. <b>Обратите внимание! Очистив всю беседу вы потеряете заданный контекст беседы!</b>`

            let CONV_NUMBER = CONVERSATION.length - 1

            if (resp.code === "context_length_exceeded") {
                $("#helper-chatgpt_response")[0].innerHTML += `<div class="mb-4 p-3" data-message_sender="assistant" style="border-radius: 10px; background-color: #E2E2E2;">
                <h6>${status} - ${resp.type}.${resp.code} (${new Date().toLocaleTimeString()})</h6>
                <div style="color: red;">
                ${markdown(resp.message)}
                </div>
                
                <div>
                    <p>${html_hint_tokenlimit}</p>

                    <div style="display: flex;">
                        <button class="btn btn-outline-secondary helper-class-chatgpt-message_keyboard-clear_conversation" style="margin-right: 10px;" onclick="deleteMessagesGPTConversation($('#helper-chatgpt-clear_conversation-${CONV_NUMBER}').val()); showAlert('Указанные сообщения удалены!');">Удалить сообщений: </button>
                        <input type="number" id="helper-chatgpt-clear_conversation-${CONV_NUMBER}" class="form-control", style="max-width: 10%; margin-right: 10px;" value="4" min="1" max="${CONVERSATION.length}">
                        <button class="btn btn-outline-primary" style="margin-right: 10px;" onclick="CONVERSATION.length = 0; showAlert('Беседа успешно очищена!')">Очистить всю беседу</button>
                    </div>

                </div>

                </div>`;

            } else {
                $("#helper-chatgpt_response")[0].innerHTML += `<div class="mb-4 p-3" data-message_sender="assistant" style="border-radius: 10px; background-color: #E2E2E2;">
                <h6>${status} - ${resp.type}.${resp.code} (${new Date().toLocaleTimeString()})</h6>
                <div style="color: red;">
                ${markdown(resp.message)}
                </div>
                </div>`;
            }
        }
    });
}


// entrypoint
window.onload = () => {
    $('#helper-btn-import_answers').on('change', function (e) { importAnswers(e) })
    
    document.querySelector(".submitbtns").innerHTML += ` <a id="helper-btn-export_answers-2" href="#" class="btn btn-secondary" onclick="exportAnswers()"><i class="fa fa-download"></i> Экспорт в JSON</a>`
    
    // const CHATGPT_USER_OBJECT = JSON.parse(document.querySelector("#helper-chatgpt-user_object").value);
    // const CHATGPT_MODEL = document.querySelector("#helper-chatgpt-model").value
    
    // console.log(CHATGPT_MODEL);

    // $("#helper-chatgpt_input")[0].oninput = () => {
    //     $("#helper-chatgpt_input")[0].style.height = "auto";
    //     $("#helper-chatgpt_input")[0].style.height = $("#helper-chatgpt_input")[0].scrollHeight + "px";
    // }
    // $("#helper-chatgpt_div_input").on("keyup", (event) => {
    //     if (event.ctrlKey && event.key === "Enter") {
    //         requestToChatGPT($("#helper-chatgpt_input").val(), CHATGPT_USER_OBJECT, CHATGPT_MODEL)
    //     }
    // })

    // $("#helper-btn-chatgpt_send").on("click", () => {
    //     requestToChatGPT($("#helper-chatgpt_input").val(), CHATGPT_USER_OBJECT, CHATGPT_MODEL)
    // })

    // $("#helper-btn-chatgpt_export").on("click", () => {
    //     let content = "<!-- Generated automatically using the LMS RANEPA HELPER extension (c) tankalxat34 -->\n";
    //     for (let i = 0; i < FULL_CONVERSATION.length; i ++) {
    //         content += `\n\n## ${FULL_CONVERSATION[i].role}\n\n`;
    //         content += `${FULL_CONVERSATION[i].content}`;
    //     }
    //     downloadFileFromText(`gpt_conversation_${new Date().toLocaleString()}.md`, content);
    // })

}

