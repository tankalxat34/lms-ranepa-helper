/**
 * Уведомяет о том, что расширение успешно загружено
 */

console.log("LMS RANEPA Helper has been enabled")


const menu_items_dropdown = [
    {
        title: "Общие настройки",
        href: "https://lms.ranepa.ru/user/preferences.php",
        blank: true,
    },
    {
        title: "GitHub",
        href: "https://github.com/tankalxat34/lms-ranepa-helper",
        blank: true,
    },
    {
        title: "Разработчик расширения",
        href: "https://vk.com/tankalxat34",
        blank: true,
    }
]


function addScript(text, document_place = document.body) {
    /*
        Добавляет скрипт в страницу
    */
    script = document.createElement("script")
    script.innerHTML = text
    document_place.appendChild(script)
}

function addSrcScriptToEnd(src) {
    _script = document.createElement("script")
    if (!src.includes("http")) {
        _script.src = chrome.runtime.getURL(src)
    } else {
        _script.src = src
    }
    document.body.appendChild(_script)
}

function addSrcScript(src) {
    _script = document.createElement("script")
    if (!src.includes("http")) {
        _script.src = chrome.runtime.getURL(src)
    } else {
        _script.src = src
    }
    document.head.appendChild(_script)
}

function addSrcCss(src) {
    _css = document.createElement("link")
    if (!src.includes("http")) {
        _css.href = chrome.runtime.getURL(src)
    } else {
        _css.href = src
    }
    _css.rel = "stylesheet"
    document.head.appendChild(_css)
}


function addButtonToServices() {
    /* 
        Добавляет кнопку для открытия сервисов LMS RANEPA Helper
    */
    let navbar = document.getElementsByClassName("nav-item")[0]

    let btnServices = document.createElement("div")
    btnServices.classList = "popover-region collapsed"

    btnServices.innerHTML = `<i class="fa fa-fw fa-list-ul" aria-hidden="true">`

    navbar.append(btnServices)
}

function showAlert(text, type_of_alert = "info", classList = "alert alert-%type_of_alert% alert-block fade in  alert-dismissible") {

    html = `${text}
    <button type="button" class="close" data-dismiss="alert">
        <span aria-hidden="true">×</span>
        <span class="sr-only">Отклонить это уведомление</span>
    </button>`

    div = document.createElement("div")
    div.classList = classList.replace("%type_of_alert%", type_of_alert)
    div.role = "alert"
    div.innerHTML = html

    document.querySelector("#user-notifications").appendChild(div)
}


function copyToClipboard(element) {
    navigator.clipboard.writeText($(element).val())
}


function downloadFileFromText(filename, content) {
    var a = document.createElement('a');
    var blob = new Blob([content], { type: "text/plain;charset=UTF-8" });
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    delete a;
}

/**
 * Добавляет новые кнопки в dropdown menu
 */
function addMenuItems() {
    let menu = document.querySelector("#carousel-item-main")

    let dropdown_header = document.createElement("div")
    dropdown_header.innerHTML = `<h5>LMS RANEPA Helper</h5>`
    dropdown_header.style.margin = "10px 10px 0px"
    menu.before(dropdown_header)

    menu_items_dropdown.forEach(element => {
        let dropdown_element = document.createElement("a")
        dropdown_element.href = element.href
        dropdown_element.innerText = element.title
        dropdown_element.classList += "dropdown-item"
        dropdown_element.setAttribute("role", "menuitem")
        dropdown_element.setAttribute("tabindex", "-1")

        if (element.blank) {
            dropdown_element.setAttribute("target", "_blank")
        }

        menu.before(dropdown_element)
    });

    let sep = document.createElement("div")
    sep.classList = "dropdown-divider"
    menu.before(sep)



    // menu.append(document.createElement("div"))
    // menu.innerHTML += `<a href="https://lms.ranepa.ru/user/preferences.php" class="dropdown-item" role="menuitem" tabindex="-1">Настройки профиля</a>`
}



function binarySearch(arr, target) {
    let start = 0;
    let end = arr.length - 1;

    while (start <= end) {
        let mid = Math.floor((start + end) / 2);

        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }

    return -1; // not found in array
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




try {

    // common scripts and functions
    addSrcScript("scripts/common_front.js")
    addSrcScript("scripts/helper_cookies.js")
    addMenuItems()

    // load options from Chrome Storage
    chrome.storage.sync.get([
        'helper-settings-disable_yametrika'
    ], (options) => {
        if (options['helper-settings-disable_yametrika']) {
            addSrcScript("scripts/_services/disableYaMetrika.js");
        }
    })

    // bootstrap addons
    // addSrcScript("https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js")

    // scripts in cases
    switch (new URL(window.location.href).pathname) {

        case "/mod/quiz/attempt.php":
            addSrcScript("scripts/mod/quiz/attempt/attempt_front.js")
            break;

        case "/my/":
            addSrcScript("scripts/my/my_front.js")
            break;

        case "/user/preferences.php":
            addSrcScript("scripts/user/preferences/preferences_front.js")
            break;

        default:
            break;
    }

} catch (error) {
    // console.log(error)
    null;
}

