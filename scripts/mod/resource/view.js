
let source_src = document.querySelector("source").src
let source_format = document.querySelector("source").type


function showAlert(text, classList = "alert alert-info alert-block fade in  alert-dismissible") {
    // html = `<div class=${classList} role="alert">
    // ${text}
    // <button type="button" class="close" data-dismiss="alert">
    //     <span aria-hidden="true">×</span>
    //     <span class="sr-only">Отклонить это уведомление</span>
    // </button>
    // </div>`

    html = `${text}
    <button type="button" class="close" data-dismiss="alert">
        <span aria-hidden="true">×</span>
        <span class="sr-only">Отклонить это уведомление</span>
    </button>`

    div = document.createElement("div")
    div.classList = classList
    div.role = "alert"
    div.innerHTML = html

    document.querySelector("#user-notifications").appendChild(div)

}

if (document.querySelector("source") && source_format.split("/")[0] === "video") {

    let a_download_video = document.createElement("span")
    a_download_video.innerHTML = `<a href="${source_src}" class="badge badge-secondary rounded mb-1" download><i class="fa fa-download"></i> Скачать: <span class="font-weight-normal">${source_format.split("/")[1]}</span></a> `
    a_download_video.innerHTML += `<a href="${source_src}" target="_blank" class="badge badge-secondary rounded mb-1"><i class="fa fa-external-link"></i> Открыть: <span class="font-weight-normal">во вкладке</span></a>`
    // a_download_video.innerHTML += `<a href="#" onclick="showAlert(text='Notification!!!')" class="badge badge-secondary rounded mb-1">Показать уведомление</a>`
    


    document.querySelector(".automatic-completion-conditions").append(a_download_video)

    

}