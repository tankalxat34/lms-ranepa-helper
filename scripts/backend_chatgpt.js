
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
     * Делает асинхронный запрос ChatGPT
     * @param {s} s строковый запрос
     * @returns промис `r.json()`
     */
    ask: async function (s, save_conversation = true) {
        save_conversation ? this.save_conversation({ "role": "user", "content": s }) : null;
    
        const url = "https://api.openai.com/v1/chat/completions";
    
        const headers = this.get_headers();
    
        const data = {
            model: this.model,
            messages: this.conversation,
        };
    
        const request = new Request(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
    
        try {
            const response = await fetch(request);
            if (!response.ok) {
                throw new Error(response.status);
            }
            const data = await response.json();
            save_conversation ? this.save_conversation(data.choices[0].message) : null;
            return data;
        } catch (error) {
            console.error('Fetch Error:', error);
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