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
    var blob = new Blob([content], { type: "text/plain;charset=UTF-8" });
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
}