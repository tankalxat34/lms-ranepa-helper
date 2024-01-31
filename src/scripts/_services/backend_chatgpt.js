
/**
 * Заменяет подстроки из первого массива на подстроки из второго массива. Возвращает новую строку
 * @param str исходная строка
 * @param first_array подстроки что заменяем
 * @param second_array подстроки на что заменяем
 * @returns {String}
 */
function translateString(str, first_array, second_array) {
    let result = str;
    for (let i = 0; i < first_array.length; i++) {
        let counter = 0;
        while (result.indexOf(first_array[i]) !== -1) {
            counter++;
            result = result.replace(first_array[i], second_array[i]);
            if (counter >= 1000) break
        }
    }
    return result
}

/**
 * Возвращает эндпонит для запросов в ChatGPT
 */
async function getGPTApiEndpoint() {
    return await chrome.storage.sync.get(["helper-chatgpt-provider_type"]);
}


var ApiEndpointSelector = {
    "https://api.openai.com/v1/chat/completions": {
        url: "https://api.openai.com/v1/chat/completions",
        get_headers: function () {
            return {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '.concat(this.uo.accessToken.trim()),
            };
        },

    }
}

// helper-chatgpt-provider-openai : https://api.openai.com/v1/chat/completions
// helper-chatgpt-provider-qidianym : https://ai.qidianym.net/api/chat-process

/**
 * Объект для реализации простейшего функционала ChatGPT
 */
var ChatGPT = {
    /**
     * Объект, возвращаемый API OpenAI, содержащий информацию о текущем юзере, его токен, email, имя и другие значения.
     * 
     * Перед использованием необходимо задать!
     */
    uo: new Object(),
    /**
     * Используемая языковая модель.
     * 
     * По умолчанию строка `gpt-3.5-turbo`.
     */
    model: 'gpt-3.5-turbo',
    /**
     * Хранит историю переписки с пользователем.
     * @returns `Array`
     */
    conversation: new Array(),
    /**
     * `true`, если нужно сохранять историю разговора. По умолчанию `false`
     */
    do_saving_conv: false,
    /**
     * `true`, если нужно очищать контекст беседы после каждого запроса. По умолчанию `false`.
     */    
    do_cleaning_after_request: false,
    /**
     * Создает правильные заголовки для запроса. Возвращает объект.
     * @returns `Object`
     */
    get_headers: function () {
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(this.uo.accessToken.trim()),
        };
    },
    /**
     * Возвращает строку с названием модели
     * @returns `String`
     */
    get_model: function () {
        return this.model;
    },
    /**
     * Делает асинхронный запрос ChatGPT. Возвращает промис.
     * @param {s} s строковый запрос
     * @param {save_conversation} save_conversation `true`, если необходимо сохранять контекст беседы
     * @returns промис `r.json()`
     */
    ask: async function (s) {
        const url = "https://api.openai.com/v1/chat/completions";

        if (this.do_saving_conv) this.save_conversation({ role: "user", content: s });
    
        const request = new Request(url, {
            method: 'POST',
            headers: this.get_headers(),
            body: JSON.stringify({
                model: this.get_model(),
                messages: this.conversation,
            })
        });
    
        try {
            const response = await fetch(request);
            const data = await response.json();
            if (!response.ok) {
                // если ошибка - вернем сообщение этой ошибки
                return await data.error.message;
            }
            // если необходимо сохранять разговор
            if (this.do_saving_conv) this.save_conversation(data.choices[0].message);
            // если необходимо очищать разговор
            if (this.do_cleaning_after_request) this.clear_conversation();
            // если все нормально - возвращаем результат
            return data;
        } catch (error) {
            // в случае ошибки - выводим ее текст в консоль
            console.log(error);
        }
    },
    /**
     * Устанавливает токен доступа к ChatGPT
     * @param {s} s строковый токен
     */
    set_token: function (s) {
        this.uo.accessToken = s.trim();
    },
    /**
     * Сохраняет сообщение в разговор с ботом ChatGPT
     * @param {section}  `{ "role": "user", "content": s }`
     */
    save_conversation: function (section) {
        this.conversation.push(section);
    },
    /**
     * Возвращает глубокую копию текущего объекта
     * @returns `Object`
     */
    copy: function () { return JSON.parse(JSON.stringify(this)) },
    /**
     * Получить текущий accessToken
     * @returns accessToken
     */
    get_accessToken: function () { return this.uo.accessToken },
    /**
     * Сбросить текущую переписку.
     * 
     * @returns `null`
     */
    clear_conversation: function () { this.conversation = new Array() },
    /**
     * Попытаться получить данные аккаунта OpenAI и загрузить их в этот объект. Работает на ChromeAPI. В случае успеха результат записывается в поле `this.uo`.
     */
    load_uo: function () { 
        chrome.storage.sync.get(["chatgpt_user_object", "helper-chatgpt-model", "helper-chatgpt-access_token"], (option) => {
            this.uo = JSON.parse(option["chatgpt_user_object"]);
            this.model = option["helper-chatgpt-model"];
            // явно указываем получение токена из хранилища браузера
            this.uo.accessToken = option["helper-chatgpt-access_token"];
        })
    }
}



/**
 * Объект для хранения функций для отображения чата и сообщений
 */
var ChatCore = {
    /**
     * Объект ChatGPT
     */
    chatgpt_object: ChatGPT,

    /**
     * Строковый селектор блока, внутри которого надо отрисовывать чат
     */
    chat_field_selector: "#helper-chatgpt_response",

    /**
     * Строковый селектор input блока, в котором пользователь набирает сообщение
     */
    chat_userinput_field_selector: "#helper-chatgpt_input",

    /**
     * Строковый селектор кнопки для отправки сообщений 
     */    
    chat_usersend_field_selector: "#helper-btn-chatgpt_send",

    _html: `<div class="row">
    <div class="col-12">
        <div class="media">
            <img src="%avatar_path%" alt="Avatar" class="mr-3 rounded-circle" style="width: 40px;">
            <div class="media-body">
                <h5 class="mt-0">%username%</h5>
                <div style="word-wrap: normal; max-width: 85%; text-align: justify;">
                    %message_html_text%
                </div>
            </div>
        </div>
        <div class="helper-chatgpt-iniline-keyboard", style="display: flex;">
            <!-- <button class="btn btn-outline-secondary mb-4 mr-2" id="helper-chatgpt-btn_copy-%iid_btn%"><i class="fa fa-clipboard"></i> Копировать</button> -->
            <!-- <button class="btn btn-outline-secondary mb-4 mr-2" id="helper-chatgpt-btn_clear_conv-%iid_btn%"><i class="fa fa-remove"></i> Очистить контекст</button> -->
        </div>
    </div>
</div>`,

    /**
     * Отрисовывает сообщение в чате по заданным параметрам
     * @param {String}    `username` Никнейм отправителя.
     * @param {String}   `msg_text_markdown` Текст сообщения в формате Markdown.
     * @param {String}  `avatar_src` Путь к фото профиля.
     */
    _drawMessage: function(username, msg_text_markdown, avatar_src) {
        let msg_index = this.chatgpt_object.conversation.length - 1;

        /**
         * Input блок ввода сообщения
         */
        let ib = document.querySelector(this.chat_userinput_field_selector);

        /**
         * ChatField. Место, где отрисовываются все сообщения
         */
        let cf = document.querySelector(this.chat_field_selector)
        
        let ts = translateString(this._html,
            [ 
                "%username%", 
                "%message_html_text%", 
                "%avatar_path%", 
                "%iid_btn%" 
            ],
            [ 
                username, 
                markdown(msg_text_markdown), 
                avatar_src, 
                `${msg_index}` 
            ]
        )
        cf.innerHTML += ts;

        ib.focus();
        cf.scroll(0, cf.scrollHeight);
        ib.style.height = "auto";
    },

    /**
     * Добавляет внутрь графического чата новое сообщение
     * @param {Object} json_response объект, содержащий имя отправителя и само сообщение в формате Markdown. Если не задан - считается, что сообщение отправил пользователь и объект генерируется внутри этой функции.
     */
    add: function (json_response) {
        /**
         * Input блок ввода сообщения
         */
        let ib = document.querySelector(this.chat_userinput_field_selector);

        /**
         * Кнопка для отправки сообщений нейросети
         */
        let sb = document.querySelector(this.chat_usersend_field_selector);

        /**
         * Блок, где отрисовываются все сообщения чата
         */
        let cf = document.querySelector(this.chat_field_selector)

        console.log(json_response)

        /**
         * Объект сообщения
         */
        let o = json_response ? json_response : { role: "user", content: ib.value };

        if (o.content === undefined) {
            o = { role: "assistant", content: json_response };
        }

        // сохраняем сообщение в беседу
        this.chatgpt_object.save_conversation(o);
        console.log(this.chatgpt_object);

        // очищаем поле ввода и блокируем его ПООЧЕРЕДНО
        ib.value = new String();
        ib.disabled = !ib.disabled;

        // // блокируем поочередно кнопку для отправки сообщений
        sb.disabled = !sb.disabled;

        this._drawMessage(
                o.role === "user" ? this.chatgpt_object.uo.user.name : o.role, 
                o.content, 
                o.role === "user" ? this.chatgpt_object.uo.user.picture : "https://raw.githubusercontent.com/tankalxat34/lms-ranepa-helper/main/openai.png"
            );
    }
}

