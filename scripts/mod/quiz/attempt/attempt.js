
const INTERNET_PATTERNS = {
    yandex: {
        url: "https://yandex.ru/search/?text=",
        replacedSpace: "+",
        name: "Яндекс"
    },
    google: {
        // url: "https://www.google.ru/search?ie=UTF-8&q=",
        url: "https://www.google.ru/search?q=",
        replacedSpace: " ",
        name: "Google"
    },
    mailru: {
        url: "https://go.mail.ru/search?mailru=1&q=",
        replacedSpace: " ",
        name: "Mail.ru"
    },
    brave: {
        url: "https://search.brave.com/search?q=",
        replacedSpace: "+",
        name: "Brave"
    },
    bing: {
        url: "https://www.bing.com/search?q=",
        replacedSpace: "+",
        name: "Bing"
    }
}


function fillButtons(qtext = "qtext") {
    let questionNodes = document.getElementsByClassName(qtext)
    let answerNodes = document.getElementsByClassName("answer")

    var questionIndex = 0
    for (let answerNode of answerNodes) {

        console.log(questionNodes[questionIndex].childNodes)

        var questionText = questionNodes[questionIndex].innerText

        if (questionNodes[questionIndex].childNodes[0].nodeName !== "#text") {
            questionText = questionNodes[questionIndex].childNodes[0].innerText
        } 

        for (let system of Object.keys(INTERNET_PATTERNS)) {
            
            let button = document.createElement("a")
            button.classList = "btn btn-secondary"
            button.style.margin = "0 5px"
            button.href = INTERNET_PATTERNS[system].url + questionText.replaceAll(" ", INTERNET_PATTERNS[system].replacedSpace)
            button.target = "_blank"
            button.innerText = INTERNET_PATTERNS[system].name
            answerNode.appendChild(button)
        }
        questionIndex++
    }
}

fillButtons()