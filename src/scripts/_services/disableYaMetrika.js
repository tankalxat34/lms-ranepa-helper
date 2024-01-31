// полностью удаляет метрику со страницы
const regex = /\d{5,}/gm;

for (let index = 0; index < document.querySelectorAll("script").length; index++) {
    let element = document.querySelectorAll("script")[index];

    if (element.text.includes("metrika")) {
        let numbers = regex_findall(regex, element.text);
        for (let j = 0; j < numbers.length; j++) {
            globalThis[`yaCounter${numbers[j]}`].destruct();
            globalThis[`disableYaCounter${numbers[j]}`] = true;
            window[`disableYaCounter${numbers[j]}`] = true;
        }
        element.disabled = true;
        element.remove()
    }
}
