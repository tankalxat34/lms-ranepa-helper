
/**
 * Объект для реализации ChatGPT. 
 * Необходимо задать `access_token`
 */
var ChatGPT = {
    access_token: "",
    model: "gpt-3.5-turbo",
    conversation: new Array(),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.access_token}`,
    },
    /**
     * Делает запрос ChatGPT
     * @param {s} s строковый запрос
     * @returns промис `r.json()`
     */
    ask: async function (s) {
        this.save_conversation({ "role": "user", "content": s })
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: this.headers,
            data: JSON.stringify({
                model: this.model,
                messages: this.conversation,
            })
        });
        this.save_conversation(r.json().choices[0].message);
        return await r.json();
    },
    /**
     * Устанавливает токен доступа к ChatGPT
     * @param {s} s строковый токен
     */
    set_token: function (s) {
        this.access_token = s;
    },
    /**
     * Сохраняет сообщение в разговор с ботом ChatGPT
     * @param {section} { "role": "user", "content": s }
     */
    save_conversation: function (section) {
        this.conversation.push(section);
    },
    copy: function () { return JSON.parse(JSON.stringify(this)) },
}