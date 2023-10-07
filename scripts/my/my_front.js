console.log("/my/ front connected")



function addToDoListeners() {
    // todo service
    const LS_KEY = "helper-services-todo";
    
    const SERVICE_TODO = document.querySelector("#helper-settings-show_todo");
    const userinput = document.querySelector("#userinput");
    const userinput_btn = document.querySelector("#userinput-btn");

    const TASKS_ACTUAL_FIELD = document.querySelector("#task-field-actual");
    const P_NOTHING_ACTUAL = document.querySelector("#helper-task-field-nothing")

    /**
     * Возвращает текущие задачи из localStorage
     * @returns {Array}    Массив задач
     */
    function getTasks() {
        return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    }
    
    /**
     * Отрисовать задачи
     */
    function draw() {
        let tasks = getTasks();
        P_NOTHING_ACTUAL.style.display = Boolean(tasks.length) ? 'none' : 'inherit';
        TASKS_ACTUAL_FIELD.innerHTML = '';

        tasks.forEach(element => {
            let div         = document.createElement("li");
            div.classList   = "helper-todo-task_item";
            div.innerText   = `${element.text}`;

            let kb = document.createElement("div");
            kb.classList    = "float-right helper-todo-task_kb";
            kb.style.zIndex = "1000";

            let kb_success = document.createElement("button");
            kb_success.classList = "helper-btn_todo-success";
            kb_success.innerHTML = `<i class="fa-solid fa-check"></i>`;
            kb.appendChild(kb_success);

            let kb_dander = document.createElement("button");
            kb_dander.classList = "helper-btn_todo-dander";
            kb_dander.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
            kb.appendChild(kb_dander);

            div.addEventListener("mouseover", () => div.classList.add("mouseover"));
            div.addEventListener("mouseleave", () => div.classList.remove("mouseover"));
            
            div.appendChild(kb);

            TASKS_ACTUAL_FIELD.appendChild(div);
        });
    }

    /**
     * Сохраняет задачу в localStorage
     * @param {String} text Текст задачи
     * @param {Number} iid Идентификатор задачи, по умолчанию текущий timestamp
     */
    function save(text, iid = Date.now()) {
        let tasks = getTasks();
        tasks.push({
            iid: iid,
            text: text
        });
        userinput.value = '';
        userinput.focus();
        localStorage.setItem(LS_KEY, JSON.stringify(tasks));
        draw();
    }

    

    userinput.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) save(userinput.value);
    })

    userinput_btn.addEventListener("click", () => save(userinput.value));

    if (!SERVICE_TODO.hidden) {
        draw();
    }
}




function DOMContentLoaded() {
    addToDoListeners();
}

document.addEventListener("readystatechange", () => document.readyState === "complete" ? DOMContentLoaded() : null);