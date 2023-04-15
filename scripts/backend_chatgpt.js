
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
    
        const headers = this.get_headers();
    
        const data = {
            model: this.get_model(),
            messages: this.conversation,
        };
    
        const request = new Request(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
    
        try {
            const response = await fetch(request);
            const data = await response.json();
            if (!response.ok) {
                // если ошибка - вернем сообщение этой ошибки
                return await data.error.message;
            }
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
     * @param {section} { "role": "user", "content": s }
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
    clear_conversation: function () { this.conversation = new Array() }
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
                <div>
                    %message_html_text%
                </div>
            </div>
        </div>
        <div class="helper-chatgpt-iniline-keyboard", style="display: flex;">
            <button class="btn btn-outline-secondary mb-4 mr-2" id="helper-chatgpt-btn_copy-%iid_btn%"><i class="fa fa-clipboard"></i> Копировать</button>
        </div>
    </div>
</div>`,

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
         * Объект сообщения
         */
        let o = json_response ? json_response : { role: "user", content: ib.value };

        // сохраняем сообщение в беседу
        this.chatgpt_object.save_conversation(o);
        console.log(this.chatgpt_object);

        // очищаем поле ввода и блокируем его ПООЧЕРЕДНО
        ib.value = new String();
        ib.disabled = !ib.disabled;

        // блокируем поочередно кнопку для отправки сообщений
        sb.disabled = !sb.disabled;

        let msg_index = this.chatgpt_object.conversation.length - 1;

        document.querySelector(this.chat_field_selector).innerHTML += this._html
            .replace("%username%", o.role)
            .replace("%message_html_text%", markdown(o.content))
            .replace("%avatar_path%", o.role === "user" ? this.chatgpt_object.uo.user.picture : "https://raw.githubusercontent.com/tankalxat34/lms-ranepa-helper/main/openai.png")
            .replace("%iid_btn%", `${msg_index}`)

        document.querySelector(`#helper-chatgpt-btn_copy-${msg_index}`).addEventListener("click", () => {
            navigator.clipboard.writeText(this.chatgpt_object.conversation[msg_index].content);
        })
    }
}
