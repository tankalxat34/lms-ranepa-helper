console.log("common front enabled!")

/**
 * Выполнить регулярное выражение в строке и вернуть `Array`
 */
function regex_findall(regex, str) {
    let m;

    var result = []

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            // console.log(`Found match, group ${groupIndex}: ${match}`);
            result.push(match);
        });
    }
    return result;
}

/**
 * Полностью удаляет яндекс метрику со страницы 
 */
function removeYaMetrika() {
    const regex = /\d{5,}/gm;

    for (let index = 0; index < document.querySelectorAll("script").length; index++) {
        let element = document.querySelectorAll("script")[index];
        
        if (element.text.includes("metrika")) {
            let numbers = regex_findall(regex, element.text);
            for (let j = 0; j < numbers.length; j++) {
                // console.log(`yaCounter${numbers[j]}`);
                // console.log(globalThis[`yaCounter${numbers[j]}`]);
                globalThis[`yaCounter${numbers[j]}`].destruct();
                globalThis[`disableYaCounter${numbers[j]}`] = true;
                window[`disableYaCounter${numbers[j]}`] = true;
            }
            element.disabled = true;
            element.remove()
        }
    }
}


/**
 * Создает объект с ключами-id и значениями value или cheched
 */
function generateOptionsObj() {
    let formElements = document.querySelectorAll("#helper-settings-card input");
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
 * Загрузить из памяти Chrome значения опций
 */
function loadOptions() {

    let formData = generateOptionsObj();
    let selectors = Object.keys(formData);

    chrome.storage.sync.get(selectors, (options) => {

        for (let index = 0; index < selectors.length; index++) {
            const s = selectors[index];
            console.log(options[s]);
            // if (document.querySelector(`#${s}`).type === "checkbox") {
            //     document.querySelector(`#${s}`).checked = options[s];
            // } else {
            //     document.querySelector(`#${s}`).value = options[s];
            // }
        }
    });
}

window.onload = function() {
    // the scripts that will be used when they are specified in the settings
    // removeYaMetrika()
}