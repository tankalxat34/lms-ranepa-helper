
const MANIFEST = chrome.runtime.getManifest();

// загружаем в ChatGPT данные аккаунта
ChatGPT.load_uo();

// отправляем приветственное сообщение
ChatCore._drawMessage(
    MANIFEST.name,
    `Добро пожаловать в альтернативный клиент ChatGPT, доступный без VPN и прочих сложностей. Обратите внимание, что все запросы к нейросети совершаются от имени вашего аккаунта.

Если что-то работает не так - обновите страницу, перезагрузите расширение в настройках браузера. Не помогло? Пишите в личку [сюда](https://tankalxat34.t.me), предварительно посмотрев консоль браузера на наличие ошибок, нажав F12.
`,
    "https://raw.githubusercontent.com/tankalxat34/lms-ranepa-helper/main/icon.png"
)

// инициализруем слушатели событий
// сохраняем элементы
let c_input             = document.querySelector(ChatCore.chat_userinput_field_selector);
let c_field             = document.querySelector(ChatCore.chat_field_selector);
let c_btn_send          = document.querySelector(ChatCore.chat_usersend_field_selector);
let c_btn_export        = document.querySelector("#helper-btn-chatgpt_export");

let c_kb_btn_clearconv  = document.querySelector("#helper-chatgpt-btn_clear_conv");

c_field.focus();

/**
 * Отрисовать сообщение пользователя, задать вопрос нейросети и отобразить ее ответ в чате
 */
let userSendMessage = () => {
    if (!!c_input.value) {
        ChatCore.add();
        ChatGPT.ask(c_input.value)
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
}

function downloadFileFromText(filename, content) {
    var a = document.createElement('a');
    var blob = new Blob([content], { type: "text/plain;charset=UTF-8" });
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
}


// автоувеличение поля чата
c_input.addEventListener("input", () => {
    c_input.style.height = "auto";
    c_input.style.height = c_input.scrollHeight + "px";
})

c_btn_export.addEventListener("click", () => {
        downloadFileFromText(`ChatGPT Exported dialog ${new Date().toLocaleString()}.html`, `<!-- Generated automatically using the LMS RANEPA HELPER extension (c) tankalxat34 -->

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style type="text/css">
* {
    background-color: #161616;
    color: #E0E0E0;
    font-family: 'segoe ui', sans-serif;
    font-size: 16.5px;
}
img {
    border-radius: 20px;
}
pre,code {
    color: #6ba193;
    font-family: consolas,'Courier New',monoscape;
}
a {
    color: cyan;
}
</style>

<h3>Exported dialog</h3>` + document.querySelector("#helper-chatgpt_response").innerHTML)
})



c_input.addEventListener("keyup", (event) => {
    if (event.ctrlKey && event.key === "Enter") {
        userSendMessage();
    }
})

c_btn_send.addEventListener("click", userSendMessage);

c_kb_btn_clearconv.addEventListener("click", () => {
    ChatGPT.clear_conversation();
    // alert("Переписка очищена, контекст беседы сброшен!");
    ChatCore._drawMessage(
        MANIFEST.name,
        "Контекст беседы очищен. Теперь нейросеть не будет обращать внимания на ваши предыдущие сообщения, так как вы начали с ней новый диалог.",
        "https://raw.githubusercontent.com/tankalxat34/lms-ranepa-helper/main/icon.png"
    )
})

// for (let index = 0; index < 50; index++) {
//     ChatCore._drawMessage("tankalxat34", "23f23f", "https://raw.githubusercontent.com/tankalxat34/lms-ranepa-helper/main/icon.png");
// }