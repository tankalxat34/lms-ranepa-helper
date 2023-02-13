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
            }
        });
    })})();
}