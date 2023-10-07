console.log("/my/ front connected")




function DOMContentLoaded() {
    // todo service
    const SERVICE_TODO = document.querySelector("#helper-settings-show_todo");
    const LS_KEY = "helper-services-todo";
    const TASKS_ACTUAL_FIELD = document.querySelector("#task-field-actual");

    document.querySelector("#userinput").addEventListener("keyup", (event) => {
        if (event.keyCode === 13) Services.todo.userReturn();
    })

    if (!SERVICE_TODO.hidden) {
        let tasks = JSON.parse(localStorage.getItem(LS_KEY));
        tasks.forEach(element => {
            ``
            tasks.innerHTML += `<p>${element.text}</p>`
        });

    }

}

document.addEventListener("readystatechange", () => document.readyState === "complete" ? DOMContentLoaded() : null);