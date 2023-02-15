
const MANIFEST = chrome.runtime.getManifest()


// const PATTERNS = {
//     s0: `${author} ${title} / ${author}, ${author2}. — ${num_redaction}. — ${city} : ${publisher}, ${year}. — ${pages_count} c. — Текст : непосредственный.`
// }


function addListenersToServices() {
    /**
     * Для сокращателя ссылок
     */
    document.querySelector('#helper-urlshorter_create').addEventListener("click", () => {
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
        
        let gost_selector = document.querySelector("#helper-rugost_selector")

        for (let index = 0; index < document.querySelectorAll('.helper-rugost_raw').length; index++) {
            const element = document.querySelectorAll('.helper-rugost_raw')[index];
            
            element.hidden = true;
            
            if (element.id === "helper-rugost_s".concat(gost_selector.value)) {
                element.hidden = false;
            }
        }
    });

    /**
     * Привязка события keyup для ГОСТ Книги
     */
    document.querySelector("#helper-rugost_s0").addEventListener("keyup", () => {
        let textarea_result = document.querySelector("#helper-rugost-result-s0")

        let author = document.querySelector("#helper-rugost-author-s0")
        let title = document.querySelector("#helper-rugost-title-s0")
        let num_redaction = document.querySelector("#helper-rugost-num_redaction-s0")
        let city = document.querySelector("#helper-rugost-city-s0")
        let publisher = document.querySelector("#helper-rugost-publisher-s0")
        let year = document.querySelector("#helper-rugost-year-s0")
        let pages_count = document.querySelector("#helper-rugost-pages_count-s0")

        textarea_result.value = `${author.value.split(",")[0].trim()} ${title.value} / ${author.value}. — ${num_redaction.value}. — ${city.value} : ${publisher.value}, ${year.value}. — ${pages_count.value} c. — Текст : непосредственный.`
    });

    /**
     * Привязка события keup для ГОСТ Статьи из журнала
     */
    document.querySelector("#helper-rugost_s1").addEventListener("keyup", () => {
        let textarea_result = document.querySelector("#helper-rugost-result-s1")

        let author = document.querySelector("#helper-rugost-author-s1")
        let title = document.querySelector("#helper-rugost-title-s1")
        let magazine_title = document.querySelector("#helper-rugost-magazine_title-s1")
        let magazine_number = document.querySelector("#helper-rugost-magazine_number-s1")
        let page = document.querySelector("#helper-rugost-page-s1")
        let year = document.querySelector("#helper-rugost-year-s1")

        textarea_result.value = `${author.value.split(",")[0].trim()} ${title.value} / ${author.value}. — Текст : непосредственный // ${magazine_title.value}. — ${year.value}. — № ${magazine_number.value}. — С. ${page.value}.`
    })

    /**
     * Привязка события keup для ГОСТ Статьи из сборника
     */
    document.querySelector("#helper-rugost_s2").addEventListener("keyup", () => {
        let textarea_result = document.querySelector("#helper-rugost-result-s2")

        let author = document.querySelector("#helper-rugost-author-s2")
        let title = document.querySelector("#helper-rugost-title-s2")
        let sbornik_title = document.querySelector("#helper-rugost-sbornik_title-s2")
        let page = document.querySelector("#helper-rugost-page-s2")
        let city = document.querySelector("#helper-rugost-city-s2")
        let publisher = document.querySelector("#helper-rugost-publisher-s2")
        let year = document.querySelector("#helper-rugost-year-s2")

        textarea_result.value = `${author.value.split(",")[0].trim()} ${title.value} / ${author.value}. — Текст : непосредственный // ${sbornik_title.value}. — ${city.value} : ${publisher.value}, ${year.value}. — С. ${page.value}.`
    })

    // ${author, value} ${title.value} / value} ${author. — Текст : электронный // ${web_title.value} : [сайт]. — URL: ${web_url.value} (дата обращения: 15.02.2023).
    /**
     * Привязка события keup для ГОСТ Интернет-ресурс
     */
    document.querySelector("#helper-rugost_s4").addEventListener("keyup", () => {
        let textarea_result = document.querySelector("#helper-rugost-result-s4")

        let author = document.querySelector("#helper-rugost-author-s4")
        let title = document.querySelector("#helper-rugost-title-s4")
        let web_title = document.querySelector("#helper-rugost-web_title-s4")
        let web_url = document.querySelector("#helper-rugost-web_url-s4")

        let date = new Date()
        
        if (author.value) {
            textarea_result.value = `${author.value.split(",")[0].trim()} ${title.value} / ${author.value}. — Текст : электронный // ${web_title.value} : [сайт]. — URL: ${web_url.value} (дата обращения: ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}).`
        } else {
            textarea_result.value = `${title.value}. — Текст : электронный // ${web_title.value} : [сайт]. — URL: ${web_url.value} (дата обращения: ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}).`
        }
    })
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