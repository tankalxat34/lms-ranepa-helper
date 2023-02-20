
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

    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
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
            if (document.querySelector(`#${s}`).type === "checkbox") {
                document.querySelector(`#${s}`).checked = options[s];
            } else {
                document.querySelector(`#${s}`).value = options[s];
            }

        }
    });
}

document.querySelector("#helper-settings-card").addEventListener("click", saveOptions)
window.addEventListener("load", loadOptions)