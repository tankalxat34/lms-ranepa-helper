

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

function requestToChatGPT(content, api_token, api_url = "https://api.openai.com/v1/chat/completions", openai_model = "gpt-3.5-turbo") {
    /*
    curl https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "What is the OpenAI mission?"}] 
    }'
    */
    $("#helper-chatgpt_response")[0].innerHTML += `<div class="mb-4 p-3" style="border-radius: 10px; background-color: #E2E2E2;">
    <h6>Вы (${new Date().toLocaleTimeString()})</h6>
    ${content}
    </div>`;
    $("#helper-chatgpt_input")[0].value = "";
    $("#helper-chatgpt_input")[0].disabled = true;
    $("#helper-btn-chatgpt_send")[0].disabled = true;

    $.ajax({
        url: 'https://api.openai.com/v1/chat/completions',
        type: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api_token}`
        },
        data: JSON.stringify({
            model: openai_model,
            messages: [
                {"role": "system", "content": "You are a helpful assistant!"},
                {"role": "user", "content": content},
            ]
        }),
        success: function (data) {
            console.log(data);
            let html = markdown(data.choices[0].message.content);
            $("#helper-chatgpt_input")[0].disabled = false;
            $("#helper-btn-chatgpt_send")[0].disabled = false;
            $("#helper-chatgpt_response")[0].innerHTML += `<div class="mb-4 p-3" style="border-radius: 10px; background-color: #E2E2E2;">
            <h6>${data.choices[0].message.role[0] + data.choices[0].message.role.slice(1)} (${new Date().toLocaleTimeString()})</h6>
            ${html}
            </div>`;
        },
        error: function (xhr, status, error) {
            let resp = xhr.responseJSON.error;
            $("#helper-chatgpt_input")[0].disabled = false;
            $("#helper-btn-chatgpt_send")[0].disabled = false;
            $("#helper-chatgpt_response")[0].innerHTML += `<div class="mb-4 p-3" style="border-radius: 10px; background-color: #E2E2E2; color: red;">
            <h6>${status} - ${resp.type}.${resp.code} (${new Date().toLocaleTimeString()})</h6>
            ${markdown(resp.message)}
            </div>`;
        }
    });
}


// entrypoint
window.onload = () => {
    $('#helper-btn-import_answers').on('change', function (e) { importAnswers(e) })
    
    document.querySelector(".submitbtns").innerHTML += ` <a id="helper-btn-export_answers-2" href="#" class="btn btn-secondary" onclick="exportAnswers()"><i class="fa fa-download"></i> Экспорт в JSON</a>`
    
    // const API_TOKEN_GPT = document.querySelector("#helper-chatgpt-access_token").getAttribute("data-access_token_p1") + document.querySelector("#helper-chatgpt-access_token").getAttribute("data-access_token_p2");
    const API_TOKEN_GPT = document.querySelector("#helper-chatgpt-access_token").value;
    
    $("#helper-chatgpt_div_input").on("keyup", (event) => {
        if (event.key === "Enter") {
            requestToChatGPT($("#helper-chatgpt_input").val(), API_TOKEN_GPT)
        }
    })

    $("#helper-btn-chatgpt_send").on("click", () => {
        requestToChatGPT($("#helper-chatgpt_input").val(), API_TOKEN_GPT)
    })

}

