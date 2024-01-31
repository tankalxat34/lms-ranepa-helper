// привязка события для перемотки видео на 10 секунд
if (document.querySelectorAll("div.video-js, video, source").length) {
  document.body.addEventListener("keydown", (e) => {
    const VIDEO = document.querySelector("video");

    switch (e.code.toLowerCase()) {
      case "arrowright":
        VIDEO.currentTime += 10;
        break;

      case "arrowleft":
        VIDEO.currentTime -= 10;
        break;

      case "space":
        VIDEO.paused ? VIDEO.play() : VIDEO.pause();
        break;

      default:
        break;
    }
  });
}

chrome.storage.sync.get(["_option_names_array"], (options) => {
  const _opt_names = options["_option_names_array"];

  chrome.storage.sync.get(_opt_names, (options) => {
    window.onload = () => {
      const videoElements = document.querySelectorAll("div.video-js, video, source");
      if (options["helper-settings-disable_video_title"]) {
        videoElements.forEach((element) => element.removeAttribute("title"));
      }

      if (
        document.querySelector("source") &&
        document.querySelector("source").type.split("/")[0] === "video"
      ) {
        let a_download_video = document.createElement("span");
        a_download_video.innerHTML = `<a href="${
          document.querySelector("source").src
        }" class="badge badge-info rounded mb-1" download><i class="fa fa-download"></i> Скачать: <span class="font-weight-normal">${
          document.querySelector("source").src.split(".")[
            document.querySelector("source").src.split(".").length - 1
          ]
        }</span></a> `;
        a_download_video.innerHTML += `<a href="${
          document.querySelector("source").src
        }" target="_blank" class="badge badge-info rounded mb-1"><i class="fa fa-external-link"></i> Открыть: <span class="font-weight-normal">во вкладке</span></a>`;

        document.querySelector("#page-content").append(a_download_video);
        document.querySelector(".automatic-completion-conditions").append(a_download_video);
      }
    };
  });
});
