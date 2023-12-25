function newCopyToClipboard(data: string) {
    // https://stackoverflow.com/questions/3436102/copy-to-clipboard-in-chrome-extension
    const copySource = document.createElement('textarea');
    copySource.textContent = data;
    document.body.appendChild(copySource);
    copySource.select();
    document.execCommand('copy');
    document.body.removeChild(copySource);
}


chrome.runtime.onMessage.addListener(function (request) {
    let resp = request.currentTab;
    let date = new Date();

    switch (request.action) {
        case 'copyToClipboardTitle':
            newCopyToClipboard(request.currentTab.title);
            break;

        case 'copyToClipboardURL':
            newCopyToClipboard(request.currentTab.url);
            break;

        case 'copyToClipboardURL-decodeURI':
            newCopyToClipboard(decodeURIComponent(request.currentTab.url));
            break;

        case 'copyToClipboardGOST-4_decodeURI':
            newCopyToClipboard(`${resp.title}. — Текст : электронный // ${new URL(resp.url).host} : [сайт]. — URL: ${decodeURI(resp.url)} (дата обращения: ${date.toLocaleDateString()}).`);
            break;

        case 'copyToClipboardGOST-EN_decodeURI':
            newCopyToClipboard(`${resp.title}, ${decodeURI(resp.url)} (accessed: ${new Date().toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric"})}).`);
            break;

        case 'copyToClipboard-openIcon':
            window.open(resp.favIconUrl, "_blank");
            break;

        case 'copyToClipboardGOST-4':
            newCopyToClipboard(`${resp.title}. — Текст : электронный // ${new URL(resp.url).host} : [сайт]. — URL: ${resp.url} (дата обращения: ${date.toLocaleDateString()}).`);
            break;

        case 'copyToClipboardGOST-EN':
            newCopyToClipboard(`${resp.title}, ${resp.url} (accessed: ${new Date().toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric"})}).`);
            break;

        default:
            break;
    }

    return true;
})