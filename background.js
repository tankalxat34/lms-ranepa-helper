
chrome.runtime.onInstalled.addListener(
    (details) => {
        if (details.reason === "install") {
            /* Действие, когда расширение было установлено */
            chrome.tabs.create({url: "https://vk.com/public207930377"})
        };
    }
)