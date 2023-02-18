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

window.onload = function() {
    // the scripts that will be used when they are specified in the settings
    removeYaMetrika()
}