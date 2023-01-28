/**
 * Уведомяет о том, что расширение успешно загружено
 */

console.log("LMS RANEPA Helper has been enabled")


function addScript(text, document_place = document.body) {
    /*
        Добавляет скрипт в страницу
    */
    script = document.createElement("script")
    script.innerHTML = text
    document_place.appendChild(script)
}

function addSrcScript(src, document_place = document.body) {
    _script = document.createElement("script")
    _script.src = chrome.runtime.getURL(src)
    document.head.appendChild(_script)
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


function downloadFileFromText(filename, content) {
    var a = document.createElement('a');
    var blob = new Blob([ content ], {type : "text/plain;charset=UTF-8"});
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    delete a;
}




try {

    addSrcScript("scripts/common.js")


    switch (new URL(window.location.href).pathname) {

        case "/mod/quiz/attempt.php":
            addSrcScript("scripts/mod/quiz/attempt/attempt_front.js")        
            break;
    
        default:
            break;
    }

} catch (error) {
    // console.log(error)
    null;
}


document.helper = new Object()
document.helper.showAlert = showAlert





