/**
 * Файл для фронтэнда на странице -/user/preferences.php
 */

const Q_VALUES = [
    {
        label_text: "Тестовый чекбокс",
        descr_html: "<p>Просто обычный чекбокс, ничего необычного</p>"
    },
    {
        label_text: "Получать уведомления о выходе версий \"в разработке\"",
        descr_html: "<p>Включив этот параметр вы будете получать уведомления о выходе предварительных версий в репозитории этого расширения</p>"
    },
    {
        label_text: "Получать уведомления о выходе версий \"в разработке\"",
        descr_html: "<p>Включив этот параметр вы будете получать уведомления о выходе предварительных версий в репозитории этого расширения</p>"
    },
]

console.log("/user/preferences.php enabled successfully")

function addQuestionButtonPopover() {
    
    for (let index = 0; index < document.querySelectorAll('div.helper-settings > div.custom-control.custom-switch').length; index++) {
        let helper_html_question = `<a class="btn btn-link p-0" role="button" data-container="body" data-toggle="popover" data-placement="right" data-content="<div class=&quot;no-overflow&quot;><p>Вы можете выбрать формат отображения времени: 12- или 24-часовой. Если выбрать настройку «по умолчанию», то формат будет автоматически выбираться в зависимости от используемого на сайте языка.</p></div> " data-html="true" tabindex="0" data-trigger="focus" data-original-title="" title="">
        <i class="icon fa fa-question-circle text-info fa-fw " title="Справка по использованию элемента «Формат времени»" role="img" aria-label="Справка по использованию элемента «Тестовый чекбокс»"></i>
        </a>`
        let element = document.querySelectorAll('div.helper-settings > div.custom-control.custom-switch')[index];
        
        element.innerHTML += helper_html_question
    }
}

addQuestionButtonPopover()