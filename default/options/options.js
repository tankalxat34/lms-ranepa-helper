
window.onselectstart = () => false;


/**
 * Вернуть массив с выбранными селекторами настроек
 */
function getOptionFields() {
    return document.querySelectorAll("#helper-settings-card input");
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
 * Загрузить из памяти Chrome значения опций
 */
function loadOptions() {

    let formData = generateOptionsObj();
    let selectors = Object.keys(formData);

    chrome.storage.sync.get(selectors, (options) => {

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

document.querySelector("#helper-settings-card").addEventListener("click", saveOptions)
window.addEventListener("load", loadOptions)