
const MANIFEST = chrome.runtime.getManifest()



function addListenersToServices() {
    /**
     * Для сокращателя ссылок
     */
    document.querySelector('#helper-urlshorter_create').addEventListener("click", () => {
        console.log("urlshort click")

        fetch("https://clck.ru/--?json=true&url=" + encodeURIComponent(document.querySelector('#helper-urlshorter_input').value))
        .then(res => res.json())
        .then(json => {
            document.querySelector('#helper-urlshorter_input').value = json[0]
            document.querySelector('#helper-urlshorter_input').select()
            navigator.clipboard.writeText(document.querySelector('#helper-urlshorter_input').value)
        })
    });
    
    /**
     * Для генератора ГОСТ
     */
    document.querySelector("#helper-rugost_selector").addEventListener("change", () => {
        console.log("rugost_selector change")
        
        for (let index = 0; index < document.querySelectorAll('.helper-rugost_raw').length; index++) {
            const element = document.querySelectorAll('.helper-rugost_raw')[index];
            element.style.display = "none"
        }
    
        let gost_selector = document.querySelector("#helper-rugost_selector")
        console.log(gost_selector.value)
    
    });
}



fetch(chrome.runtime.getURL("nodes/my/mainBlock.html"))
.then(resp => resp.text())
.then(text => {
    let extentionNode = document.createElement("section")
    extentionNode.id = "helper-hello"
    extentionNode.classList = "block_calendar_upcoming block card mb-3"
    let replacedText = text
    for (let key of Object.keys(MANIFEST)) {
        replacedText = replacedText.replace(`%${key}%`, MANIFEST[key])
    }
    extentionNode.innerHTML = replacedText

    document.getElementById("block-region-content").before(extentionNode)
    return document.querySelector("#available_new_version")
})
.then(extentionNode => {
    fetch("https://api.github.com/repos/tankalxat34/lms-ranepa-helper/releases")
    .then(resp => resp.json())
    .then(json => {
        if (json[0].name !== MANIFEST.version) {
            extentionNode.innerHTML = `<details>
            <summary><b style="color: green;">Доступна версия <a href="${json[0].html_url}" target="_blank">${json[0].name}</a></b></summary>            
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
.then(() => {
    fetch(chrome.runtime.getURL("nodes/my/servicesBlock.html"))
    .then(resp => resp.text())
    .then(text => {
        let extentionNode = document.createElement("section")
        extentionNode.id = "helper-services"
        extentionNode.classList = "block_calendar_upcoming block card mb-3"
        let replacedText = text
        extentionNode.innerHTML = replacedText
        document.getElementById("block-region-content").before(extentionNode)
    })
    .then(() => {
        addListenersToServices()
    })
})