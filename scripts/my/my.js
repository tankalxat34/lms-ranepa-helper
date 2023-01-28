
const MANIFEST = chrome.runtime.getManifest()


fetch(chrome.runtime.getURL("nodes/my/mainBlock.html"))
.then(resp => resp.text())
.then(text => {
    let extentionNode = document.createElement("section")
    extentionNode.id = "helper-hello"
    extentionNode.classList = "block_calendar_upcoming block  card mb-3"
    let replacedText = text
    for (let key of Object.keys(MANIFEST)) {
        replacedText = replacedText.replace(`%${key}%`, MANIFEST[key])
    }
    extentionNode.innerHTML = replacedText

    document.getElementById("block-region-side-pre").before(extentionNode)
    return document.querySelector("#available_new_version")
})
.then(extentionNode => {
    fetch("https://api.github.com/repos/tankalxat34/lms-ranepa-helper/releases")
    .then(resp => resp.json())
    .then(json => {
        if (json[0].name !== MANIFEST.version) {
            extentionNode.innerHTML = `<details>
            <summary><b style="color: green;">Доступна версия <a href="${json[0].html_url}">${json[0].name}</a></b></summary>            
                ${json[0].body}
                <br>
                <a href="${json[0].zipball_url}" class="btn btn-primary"><i class="fa fa-download"></i> Скачать v${json[0].name}</a>
            </details>`.replaceAll("\r\n", "<br>")
            showAlert(`Доступна новая версия расширения LMS RANEPA Helper: ${json[0].name}<br><br>Настоятельно рекомендуется обновить его до актуального состояния, чтобы получить доступ к последним функциям и возможностям!`, "warning")
        } else {
            extentionNode.innerHTML = `<small style="color: grey;">Установлена актуальная версия</small>`
        }
    })
})
