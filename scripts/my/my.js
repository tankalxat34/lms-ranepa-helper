



fetch(chrome.runtime.getURL("nodes/my/mainBlock.html"))
.then(resp => resp.text())
.then(text => {
    let extentionNode = document.createElement("section")
    extentionNode.classList = "block_calendar_upcoming block  card mb-3"
    extentionNode.innerHTML += text

    document.getElementById("block-region-side-pre").before(extentionNode)
})