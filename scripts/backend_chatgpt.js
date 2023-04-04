
/**
 * Объект для реализации ChatGPT. 
 * Необходимо задать `access_token`
 */
var ChatGPT = {
    access_token: '',
    model: 'gpt-3.5-turbo',
    conversation: new Array(),
    get_headers: function () {
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '.concat(this.access_token.trim()),
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
    ask: async function (s, save_conversation = true) {
        save_conversation ? this.save_conversation({ "role": "user", "content": s }) : null;
    
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
            // если необходимо сохранить разговор - сохраняем
            if (save_conversation) {
                // возможен случай, когда в data не будет ключа 'choices'. Тогда обрабатываем ошибку
                try {
                    this.save_conversation(data.choices[0].message);
                } catch {
                    null;
                }
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
        this.access_token = s.trim();
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
    get_accessToken: function () { return this.access_token }
}