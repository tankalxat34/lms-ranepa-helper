
const pageTitle = document.querySelector(".page-header-headings > h1").textContent;

const actions = [
    {
        title: "Скачать как HTML",
        action: () => downloadFileFromText(`${pageTitle}.html`, document.querySelector(".no-overflow").innerHTML)
    }
]


window.onload = () => {
    const frame = new HTMLComp(`<div id="helper-page-actions" class="activity-header"></div>`);
    HTMLHelper.inject("#page-content", frame, "before");

    actions.forEach(value => {
        const btn = new HTMLComp(`<button class="btn btn-secondary m-2"><% title %></button>`, { title: value.title });
        btn.html.addEventListener("click", value.action);
        frame.html.appendChild(btn.html);
    })
}