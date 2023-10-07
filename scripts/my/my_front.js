console.log("/my/ front connected")



function addToDoListeners() {
    // todo service
    const LS_KEY = "helper-services-todo";
    
    const SERVICE_TODO = document.querySelector("#helper-settings-show_todo");
    const userinput = document.querySelector("#userinput");
    const userinput_btn = document.querySelector("#userinput-btn");

    const TASKS_ACTUAL_FIELD = document.querySelector("#task-field-actual");
    const TASKS_COMPLETED_FIELD = document.querySelector("#task-field-completed");

    const P_NOTHING_ACTUAL = document.querySelector("#helper-task-field-nothing");
    const P_NOTHING_COMPLETED = document.querySelector("#helper-task-field-completed_nothing");

    /**
     * Возвращает текущие задачи из localStorage
     * @returns {Array}    Массив задач
     */
    function getTasks() {
        return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    }

    function countOfCompletedTasks() {
        let tasks = getTasks();
        let counter = 0;
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].iid < 0) counter++;
        }
        return counter;
    }

    function removeTask(iid) {
        let tasks = getTasks();
        document.querySelector(`li[data-task_iid="${iid}"]`).remove();
        for (let i = 0; i <= tasks.length; i++) {
            if (tasks[i].iid == iid) {
                tasks.splice(i, 1);
                break;
            }
        }
        localStorage.setItem(LS_KEY, JSON.stringify(tasks));
    }
    
    /**
     * Помечает задачу как отмеченную
     * @param {Number} iid Идентификатор задачи
     */
    function markAsCompleted(iid) {
        let tasks = getTasks();

        let text = document.querySelector(`li[data-task_iid="${iid}"]`).innerText;
        removeTask(iid);
        
        tasks.push({
            iid: -iid,
            text: text
        });

        localStorage.setItem(LS_KEY, JSON.stringify(tasks));        
        // document.querySelector(`li[data-task_iid="${iid}"]`).remove();
        draw();
    }

    /**
     * Отрисовать задачи
     */
    function draw() {
        let tasks = getTasks();
        P_NOTHING_ACTUAL.style.display      = Boolean(tasks.length) ? 'none' : 'inherit';
        P_NOTHING_COMPLETED.style.display   = Boolean(countOfCompletedTasks()) ? 'none' : 'inherit';
        TASKS_ACTUAL_FIELD.innerHTML        = '';
        TASKS_COMPLETED_FIELD.innerHTML     = '';

        tasks.forEach(element => {
            let div         = document.createElement("li");
            div.classList   = "helper-todo-task_item";
            if (element.iid < 0) div.classList.add("helper-todo-completed_task");
            div.innerText   = `${element.text}`;
            div.setAttribute("data-task_iid", element.iid);

            let kb = document.createElement("div");
            kb.classList    = "float-right helper-todo-task_kb";
            kb.style.zIndex = "1000";

            if (element.iid > 0) {
                let kb_success          = document.createElement("button");
                kb_success.classList    = "helper-btn_todo-success";
                kb_success.innerHTML    = `<i class="fa-solid fa-check"></i>`;
                kb_success.addEventListener("click", () => {
                    markAsCompleted(element.iid)
                });
                kb.appendChild(kb_success);
            }

            let kb_dander       = document.createElement("button");
            kb_dander.classList = "helper-btn_todo-dander";
            kb_dander.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
            kb_dander.addEventListener("click", () => {
                removeTask(element.iid);
            });
            kb.appendChild(kb_dander);

            div.addEventListener("mouseover", () => div.classList.add("mouseover"));
            div.addEventListener("mouseleave", () => div.classList.remove("mouseover"));
            
            div.appendChild(kb);

            if (element.iid > 0) {
                TASKS_ACTUAL_FIELD.appendChild(div);
            } else {
                TASKS_COMPLETED_FIELD.appendChild(div);
            }
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
        if (event.keyCode === 13 && userinput.value) save(userinput.value);
    })

    userinput_btn.addEventListener("click", () => {
        if (userinput.value) save(userinput.value);
    });

    if (!SERVICE_TODO.hidden) {
        draw();
    }
}




function DOMContentLoaded() {
    addToDoListeners();
}

document.addEventListener("readystatechange", () => document.readyState === "complete" ? DOMContentLoaded() : null);