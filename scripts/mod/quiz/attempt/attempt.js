
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

const USER = {
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
}


function getQuestions(qtext) {
    /* 
        Возвращает список всех вопросов на странице
    */
    
    let questionNodes = document.getElementsByClassName(qtext);
    let answersArray = new Array();

    for (let i = 0; i < questionNodes.length; i++) {
        let questionText = questionNodes[i].innerText;
        if (questionNodes[i].childNodes[0].nodeName !== "#text") {
            questionText = questionNodes[i].childNodes[0].innerText;
        }
        answersArray.push(questionText);
    }

    return Object.assign(answersArray)
}



function fillButtons(qtext="qtext") {
    /* 
        Заполняет блоки с вопросами кнопками с поисковыми системами 
    */

    let questionTexts = getQuestions(qtext);
    
    let answerNodes = document.getElementsByClassName("answer");

    var questionIndex = 0
    for (let answerNode of answerNodes) {

        let answerButtonDiv = document.createElement("div");

        var questionText = questionTexts[questionIndex];

        for (let system of Object.keys(INTERNET_PATTERNS)) {
            
            let button = document.createElement("a");
            button.classList = "btn btn-secondary";
            button.style.margin = "0 5px";
            button.target = "_blank";

            button.href = INTERNET_PATTERNS[system].url + questionText.replaceAll(" ", INTERNET_PATTERNS[system].replacedSpace);
            button.innerText = INTERNET_PATTERNS[system].name;

            answerButtonDiv.appendChild(button);
        }
        answerNode.appendChild(answerButtonDiv);

        questionIndex++;
    }
}



function addQuickAnswer(qtext="qtext") {
    /* 
        Добавляет текст быстрого ответа из Яндекса в каждый вопрос теста
    */
    
    let questionTexts = getQuestions(qtext);
}



function addMainBlock() {
    /*
        Добавляет блок для управления тестом
        - поделиться ответами
        - заполнить ответами
        - 
    */
    
    return 0;
}

fillButtons();