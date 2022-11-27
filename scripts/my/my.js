
const MANIFEST = chrome.runtime.getManifest()


fetch(chrome.runtime.getURL("nodes/my/mainBlock.html"))
.then(resp => resp.text())
.then(text => {
    let extentionNode = document.createElement("section")
    extentionNode.classList = "block_calendar_upcoming block  card mb-3"
    let replacedText = text
    for (let key of Object.keys(MANIFEST)) {
        replacedText = replacedText.replace(`%${key}%`, MANIFEST[key])
    }
    extentionNode.innerHTML = replacedText

    document.getElementById("block-region-side-pre").before(extentionNode)
})