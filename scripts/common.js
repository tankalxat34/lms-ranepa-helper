/**
 * Уведомяет о том, что расширение успешно загружено
 */

console.log("LMS RANEPA Helper has been enabled")


const menu_items_dropdown = [
    {
        title: "Общие настройки",
        href: "https://lms.ranepa.ru/user/preferences.php",
        blank: true,
    }
]


/**
 * Заменяет подстроки из первого массива на подстроки из второго массива. Возвращает новую строку
 * @param str исходная строка
 * @param first_array подстроки что заменяем
 * @param second_array подстроки на что заменяем
 * @returns {String}
 */
function translateString(str, first_array, second_array) {
    let result = str;
    for (let i = 0; i < first_array.length; i++) {
        let counter = 0;
        while (result.indexOf(first_array[i]) !== -1) {
            counter++;
            result = result.replace(first_array[i], second_array[i]);
            if (counter >= 1000) break
        }
    }
    return result
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
 * Добавить скрипт в head
*/
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


function copyToClipboard(element) {
    navigator.clipboard.writeText($(element).val())
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




try {

    // common scripts and functions
    addSrcScript("scripts/common_front.js")
    addSrcScript("scripts/helper_cookies.js")
    addSrcScript("scripts/drawdown.js");
    addMenuItems()

    // get option names from Chrome Storage
    chrome.storage.sync.get(["_option_names_array"], (options) => {

        var _opt_names = options["_option_names_array"]

        // load all options from Chrome Storage
        chrome.storage.sync.get(_opt_names, (options) => {

            console.log(options)

            if (options['helper-settings-disable_yametrika']) {
                addSrcScript("scripts/_services/disableYaMetrika.js");
            }
        })
    });


    // bootstrap addons
    // addSrcScript("https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js")

    // scripts in cases
    switch (new URL(window.location.href).pathname) {

        case "/mod/quiz/attempt.php":
            addSrcScript("scripts/mod/quiz/attempt/attempt_front.js");
            break;

        case "/my/":
            addSrcScript("scripts/my/my_front.js")
            break;

        case "/user/preferences.php":
            addSrcScript("scripts/user/preferences/preferences_front.js")
            break;
        
        case "/mod/page/view.php":
            addSrcScript("scripts/mod/page/view/view_front.js")
            break;

        default:
            break;
    }

} catch (error) {
    // console.log(error)
    null;
}


