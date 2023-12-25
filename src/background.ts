const MANIFEST = chrome.runtime.getManifest()


async function getCurrentTab() {
    let queryOptions = { active: true };
    return await chrome.tabs.query(queryOptions);
}

async function genericOnClick(info: { menuItemId: any; }) {
    let currentTab = await getCurrentTab();
    chrome.tabs.sendMessage(currentTab[0].id as number, {
        action: info.menuItemId,
        currentTab: currentTab[0]
    })
}

chrome.contextMenus.onClicked.addListener(genericOnClick);

chrome.runtime.onInstalled.addListener(function (details) {

    
    chrome.contextMenus.create({
        title: "Скопировать...",
        id: 'parent',
    })

    chrome.contextMenus.create({
        title: "Заголовок страницы",
        id: 'copyToClipboardTitle',
        parentId: 'parent'
    });
    chrome.contextMenus.create({
        title: "Ссылку на страницу",
        id: 'copyToClipboardURL',
        parentId: 'parent'
    });
    chrome.contextMenus.create({
        title: "Декодированная Ссылку на страницу",
        id: 'copyToClipboardURL-decodeURI',
        parentId: 'parent'
    });

    chrome.contextMenus.create({
        id: "copyToClipboardSeparator1",
        type: 'separator',
        parentId: 'parent'
    });

    chrome.contextMenus.create({
        title: "Открыть иконку в новом окне",
        id: 'copyToClipboard-openIcon',
        parentId: 'parent'
    })

    chrome.contextMenus.create({
        id: "copyToClipboardSeparator2",
        type: 'separator',
        parentId: 'parent'
    });

    chrome.contextMenus.create({
        title: "Интернет-источник (РФ ГОСТ 7.0.5-2008)",
        id: 'copyToClipboardGOST-4',
        parentId: 'parent'
    });

    chrome.contextMenus.create({
        title: "📔 Декодированный Интернет-источник (РФ ГОСТ 7.0.5-2008)",
        id: 'copyToClipboardGOST-4_decodeURI',
        parentId: 'parent'
    });
    chrome.contextMenus.create({
        title: "Англоязычный Интернет-источник (РФ ГОСТ 7.0.5-2008)",
        id: 'copyToClipboardGOST-EN',
        parentId: 'parent'
    });
    chrome.contextMenus.create({
        title: "📔 Декодированный англоязычный Интернет-источник (РФ ГОСТ 7.0.5-2008)",
        id: 'copyToClipboardGOST-EN_decodeURI',
        parentId: 'parent'
    });


    if (details.reason === "install") {
        /* Действие, когда расширение было установлено */
        chrome.tabs.create({ url: chrome.runtime.getURL("default/welcome/welcome.html") });
    };


});
