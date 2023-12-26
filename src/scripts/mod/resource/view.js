
// привязка события для перемотки видео на 10 секунд
document.body.addEventListener("keyup", (e) => {
    console.log(e)
    if (e.code === 39) {
        document.querySelector("video").currentTime += 10
    }
    else if (e.code === 37) {
        document.querySelector("video").currentTime -= 10
    }
})


chrome.storage.sync.get(["_option_names_array"], (options) => {
    const _opt_names = options["_option_names_array"];
    
    chrome.storage.sync.get(_opt_names, (options) => {
        window.onload = () => {
            if (options['helper-settings-disable_video_title']) {
                const videoElements = document.querySelectorAll("div.video-js, video, source");
                
                videoElements.forEach(element => element.removeAttribute("title"));
            }

            if (document.querySelector("source") && document.querySelector("source").type.split("/")[0] === "video") {
            
                let a_download_video = document.createElement("span")
                if (options['helper-settings-show_download_video_button']) a_download_video.innerHTML = `<a href="${document.querySelector("source").src}" class="badge badge-info rounded mb-1" download><i class="fa fa-download"></i> Скачать: <span class="font-weight-normal">${document.querySelector("source").src.split(".")[document.querySelector("source").src.split(".").length - 1]}</span></a> `
                if (options['helper-settings-show_targetblank_video_button']) a_download_video.innerHTML += `<a href="${document.querySelector("source").src}" target="_blank" class="badge badge-info rounded mb-1"><i class="fa fa-external-link"></i> Открыть: <span class="font-weight-normal">во вкладке</span></a>`
            
                document.querySelector(".automatic-completion-conditions").append(a_download_video)
            }
        }
    });
}); 

