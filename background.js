
const MANIFEST = chrome.runtime.getManifest()


chrome.runtime.onInstalled.addListener(
    (details) => {
        if (details.reason === "install") {
            /* Действие, когда расширение было установлено */
            chrome.tabs.create({url: chrome.runtime.getURL("default/welcome/welcome.html")});
        };
    }
)