console.log("/my/ front connected")

window.onload = () => {
    /**
     * Для сокращателя ссылок
     */
    (function() {document.querySelector('#helper-urlshorter_create').addEventListener("click", () => {
        $.ajax({
            dataType: "json",
            url: 'https://clck.ru/--?json=true&url=' + encodeURIComponent($('#helper-urlshorter_input').val()),
            success: (res) => {
                // console.log(res)
                $('#helper-urlshorter_input').val(res[0]);
                $('#helper-urlshorter_input')[0].select();
                copyToClipboard('#helper-urlshorter_input');
                showAlert("Ссылка успешно скопирована!");
            },
            error: (res) => {
                showAlert("Произошла ошибка! Смотрите консоль по кнопке F12", "danger")
                console.log(res)
            }
        });
    })})();

    (function() {
        document.querySelector("#helper-rugost_selector").addEventListener("change", (e) => {
            
            for (let index = 0; index < $('.helper-rugost_raw').length; index++) {
                const element = $('.helper-rugost_raw')[index];
                element.style.display = "none"
            }

            let gost_selector = document.querySelector("#helper-rugost_selector")
            console.log(gost_selector.value)

        })
    })();
}