
window.onselectstart = () => false;


/**
 * Вернуть массив с выбранными селекторами настроек
 */
function getOptionFields() {
    return document.querySelectorAll("#helper-settings-card input")
}


/**
 * Сохранить настройки в память Chrome
*/
function saveOptions() {
    let doc_newest_commit_message = document.querySelector("#helper-settings-get_newest_commit_message").checked;
    let doc_show_clck = document.querySelector("#helper-settings-show_clck").checked;
    let doc_show_rugost = document.querySelector("#helper-settings-show_rugost").checked;
    let doc_show_searchinput_courses = document.querySelector("#helper-settings-show_searchinput_courses").checked;
    let doc_disable_yametrika = document.querySelector("#helper-settings-disable_yametrika").checked;
    let doc_changeable_form_action = document.querySelector("#helper-settings-changeable_form_action").checked;
    let doc_show_hidden_inputs = document.querySelector("#helper-settings-show_hidden_inputs").checked;
    
    chrome.storage.sync.set({
        doc_newest_commit_message,
        doc_show_clck,
        doc_show_rugost,
        doc_show_searchinput_courses,
        doc_disable_yametrika,
        doc_changeable_form_action,
        doc_show_hidden_inputs
    }, (e) => {
        console.log(e);
        console.log('Options saved');
    });
}

/**
 * Загрузить из памяти Chrome значения опций
 */
function loadOptions() {
    chrome.storage.sync.get([
        "doc_newest_commit_message",
        "doc_show_clck",
        "doc_show_rugost",
        "doc_show_searchinput_courses",
        "doc_disable_yametrika",
        "doc_changeable_form_action",
        "doc_show_hidden_inputs"
    ], (options) => {
        
        document.querySelector("#helper-settings-get_newest_commit_message").checked = options.doc_newest_commit_message;
        document.querySelector("#helper-settings-show_clck").checked = options.doc_show_clck;
        document.querySelector("#helper-settings-show_rugost").checked = options.doc_show_rugost;
        document.querySelector("#helper-settings-show_searchinput_courses").checked = options.doc_show_searchinput_courses;
        document.querySelector("#helper-settings-disable_yametrika").checked = options.doc_disable_yametrika;
        document.querySelector("#helper-settings-changeable_form_action").checked = options.doc_changeable_form_action;
        document.querySelector("#helper-settings-show_hidden_inputs").checked = options.doc_show_hidden_inputs;


        console.log("doc_newest_commit_message", options.doc_newest_commit_message)
        console.log("doc_show_clck", options.doc_show_clck)
        console.log("doc_show_rugost", options.doc_show_rugost)
        console.log("doc_show_searchinput_courses", options.doc_show_searchinput_courses)
        console.log("doc_disable_yametrika", options.doc_disable_yametrika)
        console.log("doc_changeable_form_action", options.doc_changeable_form_action)
        console.log("doc_show_hidden_inputs", options.doc_show_hidden_inputs)
    });
}

// document.querySelector("#helper-settings-btn_save").addEventListener("click", saveOptions)
document.querySelector("#helper-settings-card").addEventListener("click", saveOptions)
window.addEventListener("load", loadOptions)