window.onload = () => {
    let badge = document.createElement("span");
    badge.innerHTML = `<a class="badge badge-info rounded mb-1"><i class="fa fa-download"></i> Скачать в HTML</a> `
    badge.addEventListener("click", () => {
        downloadFileFromText(`${document.querySelector(".page-header-headings > h1").textContent}.html`, document.querySelector(".no-overflow").innerHTML)
    });
    badge.style.cursor = "pointer";
    badge.title = `Нажав на кнопку вы сможете скачать контент с этой страницы в виде HTML файла`
    document.querySelector(".automatic-completion-conditions").append(badge);
}