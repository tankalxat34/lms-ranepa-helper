/**
 * Бекэнд часть для -/user/preferences.php
 */

fetch(chrome.runtime.getURL("nodes/user/preferences/settings.block.html"))
.then(resp => resp.text())
.then(text => {
    let extentionNode = document.createElement("section")
    extentionNode.id = "helper-settings"
    extentionNode.style.paddingLeft = "15px"
    extentionNode.style.paddingRight= "15px"
    // extentionNode.classList = "block_calendar_upcoming block card mb-3"
    let replacedText = text

    extentionNode.innerHTML = replacedText

    document.getElementById("region-main-box").before(extentionNode)
    // return document.querySelector("#available_new_version")
})