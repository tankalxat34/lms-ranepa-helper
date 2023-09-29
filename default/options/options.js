
// window.onselectstart = () => false;


/**
 * Вернуть массив с выбранными селекторами настроек
 */
function getOptionFields() {
    return document.querySelectorAll("#helper-settings-card input,select");
}


/**
 * Создает объект с ключами-id и значениями value или cheched
 */
function generateOptionsObj() {
    let formElements = getOptionFields();
    let formData = {};
    formData["_option_names_array"] = new Array();

    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        formData["_option_names_array"].push(element.id)
        if (element.id) {
            if (element.type === "checkbox") {
                formData[element.id] = element.checked;
            } else {
                formData[element.id] = element.value;
            }
        }
    }
    return formData;
}


/**
 * Сохранить настройки в память Chrome
*/
function saveOptions() {

    let formData = generateOptionsObj();
    console.log(formData)

    chrome.storage.sync.set(formData, (e) => {
        console.log(e);
        console.log('Options saved');
    });
}


/**
 * Делает запрос к аутентификации OpenAI, получает токен и устанавливает его в специальное поле на странице настроек. Уведомляет об успешности операции или о возможном провале.
 */
function _getAccessTokenFromChatGPT() {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch("https://chat.openai.com/api/auth/session", {
        headers: headers,
        credentials: 'include'
    })
    .then(r => {
        return r.json();
    })
    .then(j => {
        let last_j = j
        last_j.accessToken = j.accessToken || document.querySelector("#helper-chatgpt-access_token").value;
        chrome.storage.sync.set({ chatgpt_user_object: JSON.stringify(last_j) }, () => {
            console.log("UserObject saved succesfully!");
            console.log('access token all parts saved');
            document.querySelector("#helper-chatgpt-access_token_span").innerText = `${last_j.user.email}`;
            document.querySelector("#helper-chatgpt-access_token_span").style.color = "green";
            document.querySelector("#helper-chatgpt-access_token").value = last_j.accessToken;
        })
    })
    .catch(e => {
        // console.log(e);
        document.querySelector("#helper-chatgpt-access_token_descr").innerText = "Внимание! Это сообщение об ошибке может быть недостоверным. Самостоятельно проверяйте работу ChatGPT в СДО/ДПО РАНХиГС. Со включенным VPN проблемы с получением ответа от OpenAI не будет.";
        document.querySelector("#helper-chatgpt-access_token_descr").style.color = "#FF7F00";
        document.querySelector("#helper-chatgpt-access_token_span").innerText = "Ошибка получения данных от OpenAI. Войдите в аккаунт на официальном сайте или повторите попытку позднее.";
        document.querySelector("#helper-chatgpt-access_token_span").style.color = "red";
        chrome.storage.sync.get(["helper-chatgpt-access_token"], (options) => {
            document.querySelector("#helper-chatgpt-access_token").value = options["helper-chatgpt-access_token"];
        })
    })
}


/**
 * Загрузить из памяти Chrome значения опций
 */
function loadOptions() {
    let formData = generateOptionsObj();
    let selectors = Object.keys(formData);

    chrome.storage.sync.get([...selectors, "chatgpt_user_object"], (options) => {

        let chatgpt_user_object = JSON.parse(options["chatgpt_user_object"]);

        if (!options["helper-settings-get_localuser_token"]) {
            _getAccessTokenFromChatGPT();
        } else {
            document.querySelector("#helper-chatgpt-access_token_span").innerText = `${chatgpt_user_object.user.email} (используется указанный вами токен)`;
            document.querySelector("#helper-chatgpt-access_token_span").style.color = "grey";
        }

        for (let index = 0; index < selectors.length; index++) {
            const s = selectors[index];
            if (s.slice(0, 1) !== "_") {
                if (document.querySelector(`#${s}`).type === "checkbox") {
                    document.querySelector(`#${s}`).checked = options[s];
                } else {
                    document.querySelector(`#${s}`).value = options[s];
                }
            }
        }
    });
}


/**
 * Удалить из памяти Chrome значения опций
 */
function clearOptions() {

    let formData = generateOptionsObj();
    let selectors = Object.keys(formData);

    for (let index = 0; index < selectors.length; index++) {
        const s = selectors[index];
        if (s.slice(0, 1) !== "_") {
            if (document.querySelector(`#${s}`).type === "checkbox") {
                document.querySelector(`#${s}`).checked = false;
            } else {
                document.querySelector(`#${s}`).value = new String();
            }
        }
    }

    chrome.storage.sync.clear();
    saveOptions();
}

/*
Default names (ids) of options:

helper-settings-changeable_form_action
helper-settings-disable_yametrika
helper-settings-get_newest_commit_message
helper-settings-show_clck
helper-settings-show_hidden_inputs
helper-settings-show_rugost
helper-settings-show_searchinput_courses
*/

document.querySelector("#helper-settings-options").addEventListener("click", saveOptions);
document.querySelector("#helper-settings-btn_clear").addEventListener("click", clearOptions);
window.addEventListener("load", loadOptions);