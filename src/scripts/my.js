const MANIFEST = chrome.runtime.getManifest();


// const buttonComp = new HTMLComp(`<button class="btn btn-primary"><%name1%></button>`, {name1: "Этот текст должен быть в кнопке"});
// HTMLHelper.inject("#inst4066", buttonComp);

// buttonComp.html.textContent = "А это измененный текст!";
// buttonComp.set("textContent", "И снова поменял текст!");


/**
 * Объект, содержащий в себе объекты (сервисы), которые в себе содержат методы управления этими сервисами.
 * 
 * Чуть ниже есть функция, внутри которой все перечисленные листенеры подключаются к соответствующим элементам
 */
var Services = {
    /**
     * Сокращатель ссылок от Яндекса.
     * 
     * Содержит методы для создания ссылки и очистки формы 
     */
    urlshorter: {
        create: function () {
            fetch("https://clck.ru/--?json=true&url=" + encodeURIComponent(document.querySelector('#helper-urlshorter_input').value))
                .then(res => res.json())
                .then(json => {
                    document.querySelector('#helper-urlshorter_input').value = json[0]
                    document.querySelector('#helper-urlshorter_input').select()
                    navigator.clipboard.writeText(document.querySelector('#helper-urlshorter_input').value)
                })
        },
        clear: function () {
            document.querySelector("#helper-qrmaker_img").removeAttribute("src")
            document.querySelector("#helper-qrmaker_img").hidden = true
            document.querySelector("#helper-urlshorter_input").value = ""
        }
    },

    /**
     * Генератор библиографического описания
     */
    rugost: {
        /**
         * Листенер для выпадающего списка с вариантами Источников
         */
        selector: function () {
            let gost_selector = document.querySelector("#helper-rugost_selector")

            for (let index = 0; index < document.querySelectorAll('.helper-rugost_raw').length; index++) {
                const element = document.querySelectorAll('.helper-rugost_raw')[index];

                element.hidden = true;

                if (element.id === "helper-rugost_s".concat(gost_selector.value)) {
                    element.hidden = false;
                }
            }
        },
        /**
         * Очистка формы
         */
        clear: function () {
            let gost_selector = document.querySelector("#helper-rugost_selector")
            let selector = "#helper-rugost_s".concat(gost_selector.value)
            let elements = document.querySelectorAll(`div${selector} > input`)

            if (gost_selector.value !== "-1") {
                for (let index = 0; index < elements.length; index++) {
                    const element = elements[index];
                    element.value = ""
                }

                document.querySelector(`div${selector} > textarea`).value = ""
            }
        },
        /**
         * Источник: Книга
         */
        s0: function () {
            let textarea_result = document.querySelector("#helper-rugost-result-s0")

            let author = document.querySelector("#helper-rugost-author-s0")
            let title = document.querySelector("#helper-rugost-title-s0")
            let num_redaction = document.querySelector("#helper-rugost-num_redaction-s0")
            let city = document.querySelector("#helper-rugost-city-s0")
            let publisher = document.querySelector("#helper-rugost-publisher-s0")
            let year = document.querySelector("#helper-rugost-year-s0")
            let pages_count = document.querySelector("#helper-rugost-pages_count-s0")

            textarea_result.value = `${author.value.split(",")[0].trim()} ${title.value} / ${author.value}. — ${num_redaction.value}. — ${city.value} : ${publisher.value}, ${year.value}. — ${pages_count.value} c. — Текст : непосредственный.`
        },
        /**
         * Статьи из журнала
         */
        s1: function () {
            let textarea_result = document.querySelector("#helper-rugost-result-s1")

            let author = document.querySelector("#helper-rugost-author-s1")
            let title = document.querySelector("#helper-rugost-title-s1")
            let magazine_title = document.querySelector("#helper-rugost-magazine_title-s1")
            let magazine_number = document.querySelector("#helper-rugost-magazine_number-s1")
            let page = document.querySelector("#helper-rugost-page-s1")
            let year = document.querySelector("#helper-rugost-year-s1")

            textarea_result.value = `${author.value.split(",")[0].trim()} ${title.value} / ${author.value}. — Текст : непосредственный // ${magazine_title.value}. — ${year.value}. — № ${magazine_number.value}. — С. ${page.value}.`
        },
        /**
         * Статьи из сборника
         */
        s2: function () {
            let textarea_result = document.querySelector("#helper-rugost-result-s2")

            let author = document.querySelector("#helper-rugost-author-s2")
            let title = document.querySelector("#helper-rugost-title-s2")
            let sbornik_title = document.querySelector("#helper-rugost-sbornik_title-s2")
            let page = document.querySelector("#helper-rugost-page-s2")
            let city = document.querySelector("#helper-rugost-city-s2")
            let publisher = document.querySelector("#helper-rugost-publisher-s2")
            let year = document.querySelector("#helper-rugost-year-s2")

            textarea_result.value = `${author.value.split(",")[0].trim()} ${title.value} / ${author.value}. — Текст : непосредственный // ${sbornik_title.value}. — ${city.value} : ${publisher.value}, ${year.value}. — С. ${page.value}.`
        },
        /**
         * Интернет ресурс
         */
        s4: function () {
            let textarea_result = document.querySelector("#helper-rugost-result-s4")

            let author = document.querySelector("#helper-rugost-author-s4")
            let title = document.querySelector("#helper-rugost-title-s4")
            let web_title = document.querySelector("#helper-rugost-web_title-s4")
            let web_url = document.querySelector("#helper-rugost-web_url-s4")

            let date = new Date()

            if (author.value) {
                textarea_result.value = `${author.value.split(",")[0].trim()} ${title.value} / ${author.value}. — Текст : электронный // ${web_title.value} : [сайт]. — URL: ${web_url.value} (дата обращения: ${date.toLocaleDateString()}).`
            } else {
                textarea_result.value = `${title.value}. — Текст : электронный // ${web_title.value} : [сайт]. — URL: ${web_url.value} (дата обращения: ${date.toLocaleDateString()}).`
            }
        }
    }
}


/**
 * Выполнить регулярное выражение в строке и вернуть `Array`
 */
function regex_findall(regex, str) {
    let m;

    var result = []

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            // console.log(`Found match, group ${groupIndex}: ${match}`);
            result.push(match);
        });
    }
    return result;
}


function addListenersToServices() {
    /**
     * Для сокращателя ссылок
     */
    document.querySelector('#helper-urlshorter_create').addEventListener("click", Services.urlshorter.create);
    document.querySelector('#helper-urlshorter_remove').addEventListener("click", Services.urlshorter.clear);

    /**
     * Для генератора ГОСТ
     */
    document.querySelector("#helper-rugost_selector").addEventListener("change", Services.rugost.selector);

    /**
     * Кнопка очистки формы для ГОСТ
     */
    document.querySelector("#helper-rugost-btn_clear").addEventListener("click", Services.rugost.clear);

    /**
     * Привязка события keyup для ГОСТ Книги
     */
    document.querySelector("#helper-rugost_s0").addEventListener("keyup", Services.rugost.s0);

    /**
     * Привязка события keup для ГОСТ Статьи из журнала
     */
    document.querySelector("#helper-rugost_s1").addEventListener("keyup", Services.rugost.s1);

    /**
     * Привязка события keup для ГОСТ Статьи из сборника
     */
    document.querySelector("#helper-rugost_s2").addEventListener("keyup", Services.rugost.s2);

    /**
     * Привязка события keup для ГОСТ Интернет-ресурс
     */
    document.querySelector("#helper-rugost_s4").addEventListener("keyup", Services.rugost.s4);
}

fetchDoc("nodes/my/mainBlock.html")
.then(resp => console.log(resp))
.catch(e => console.log(e));



fetch(chrome.runtime.getURL("nodes/my/mainBlock.html"))
    .then(resp => resp.text())
    .then(text => {
        let extentionNode = document.createElement("section")
        extentionNode.id = "helper-hello"
        extentionNode.classList = "block_calendar_upcoming block card mb-3"
        let replacedText = text
        for (let key of Object.keys(MANIFEST)) {
            replacedText = replacedText.replace(`%${key}%`, MANIFEST[key])
        }
        extentionNode.innerHTML = replacedText

        document.getElementById("block-region-content").before(extentionNode);
        return document.querySelector("#available_new_version")
    })
    .then(extentionNode => {
        fetch("https://api.github.com/repos/tankalxat34/lms-ranepa-helper/releases")
            .then(resp => resp.json())
            .then(json => {
                if (json[0].name !== MANIFEST.version) {
                    extentionNode.innerHTML = `<details>
            <summary><b style="color: #fd7e14">Доступна версия <a href="${json[0].html_url}" target="_blank">${json[0].name}</a></b></summary>            
                ${markdown(json[0].body)}
                <a href="${json[0].zipball_url}" class="btn btn-primary"><i class="fa fa-download"></i> Скачать v${json[0].name}</a>
            </details>`.replaceAll("\r\n", "<br>")
                } else {
                    extentionNode.innerHTML = `<small style="color: grey;">Установлена актуальная версия</small>`
                }
            })
    })
    .then(() => {
        fetch(chrome.runtime.getURL("nodes/my/servicesBlock.html"))
            .then(resp => resp.text())
            .then(text => {
                let extentionNode = document.createElement("section")
                extentionNode.id = "helper-services"
                extentionNode.classList = "block_calendar_upcoming block card mb-3"
                let replacedText = text
                extentionNode.innerHTML = replacedText
                document.getElementById("block-region-content").before(extentionNode)
            })
            .then(() => {
                addListenersToServices()
            })
            .then(() => {
                // get option names from Chrome Storage
                chrome.storage.sync.get(["_option_names_array"], (options) => {

                    var _opt_names = options["_option_names_array"];

                    // load all options from Chrome Storage
                    chrome.storage.sync.get(_opt_names, (options) => {

                        let max_counter_services = 0;
                        let disabled_counter_services = 0;

                        // show all hidden services if it is be able by user settings
                        for (let index = 0; index < _opt_names.length; index++) {
                            const name = _opt_names[index];
                            if (name.slice(0, 1) !== "_" && document.querySelector(`#${name}`)) {
                                document.querySelector(`#${name}`).hidden = !options[name];
                                if (!options[name]) disabled_counter_services++;
                                max_counter_services++;
                            }
                        }

                        // make hidden section with services if that is will be empty
                        if (disabled_counter_services === max_counter_services) document.querySelector("#helper-services").hidden = true;


                        document.querySelector('[data-block="mydashboard"]').before(document.querySelector('[data-block="calendar_upcoming"]'));
                        let h5_node_1 = document.querySelector('[data-block="calendar_upcoming"] > div > h5');
                        if (document.querySelector('[data-block="calendar_upcoming"] > div > div > div > div').childElementCount - 1) {
                            document.querySelector('[data-block="calendar_upcoming"]').innerHTML = `<details class="m-3">
                    <summary>
                    <b style="font-size: 17px;">${h5_node_1.innerText} <span class="badge badge-pill badge-info">${document.querySelector('[data-block="calendar_upcoming"] > div > div > div > div').childElementCount - 1}</span></b>
                    </summary>
                    ${document.querySelector('[data-block="calendar_upcoming"] > div').innerHTML}
                    </details>`;
                        } else {
                            document.querySelector('[data-block="calendar_upcoming"]').innerHTML = `<details class="m-3">
                    <summary>
                    <b style="font-size: 17px;">${h5_node_1.innerText}</b>
                    </summary>
                    ${document.querySelector('[data-block="calendar_upcoming"] > div').innerHTML}
                    </details>`;
                        }
                        document.querySelector('[data-block="calendar_upcoming"] > details > h5').remove();


                        if (options["helper-settings-show_courses_filters"]) {
                            // Показать только невыполненные
                            let place = document.querySelector(".mydashboard-filters-grouping");

                            let filter_only_not100 = document.createElement("div");
                            filter_only_not100.classList = "filter-btn-box";

                            let a_filter_only_not100 = document.createElement("a");
                            a_filter_only_not100.id = "helper-settings-show_courses_filters-filter_only_not100"
                            a_filter_only_not100.classList = "filter-btn";
                            a_filter_only_not100.href = "#";
                            a_filter_only_not100.innerText = "Невыполненные";

                            a_filter_only_not100.addEventListener("click", () => {
                                // скрыть active на всех фильтрах
                                for (let filter_element of document.querySelectorAll("div.filter-btn-box .filter-btn")) {
                                    filter_element.classList.remove("active");
                                }

                                a_filter_only_not100.classList.add("active");
                                let cards = document.querySelector("div[data-region=\"paged-content-page\"]").children[0].childNodes;

                                for (let card of cards) {
                                    let card_text = card.textContent.replaceAll("\n", " ").trim().toLowerCase();
                                    if (regex_findall(/прогресс: *100\%/gm, card_text)[0] || card_text.includes("100%")) {
                                        card.hidden = true;
                                    } else {
                                        card.hidden = false;
                                    };
                                };
                            });

                            filter_only_not100.appendChild(a_filter_only_not100);

                            place.appendChild(filter_only_not100);

                            // подключаем корректное отображение фильтра
                            document.querySelector(".mydashboard-filters-sort-display-box").addEventListener("click", () => {
                                // скрыть active на всех фильтрах
                                for (let filter_element of document.querySelectorAll("div.filter-btn-box .filter-btn")) {
                                    filter_element.classList.remove("active");
                                }
                                document.querySelector('a[data-value="inprogress"]').classList.add("active");
                            })
                        }

                        // включает отображение часов
                        if (options["helper-settings-show_clock"]) {
                            setInterval(() => {
                                // (document.querySelector("#page-header > div > div.d-flex.align-items-center > div.mr-auto > div > div > h1") || document.querySelector("#page-header > div > div.d-flex.align-items-center > h2")).innerText = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
                                (document.querySelector("#helper-clock")).innerText = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
                            }, 1000);
                        }


                        if (options["helper-settings-show_searchinput_courses"]) {

                            let place = document.querySelector('[data-block="mydashboard"]');

                            let div_search = document.createElement("div");
                            div_search.classList = "m-3";
                            div_search.style.right = "0";
                            div_search.style.top = "0";
                            div_search.style.position = "absolute";
                            div_search.style.minWidth = "80%";

                            let input_search = document.createElement("input");
                            input_search.type = "text";
                            input_search.id = "helper-settings-show_searchinput_courses";
                            input_search.classList = "form-control mr-2";
                            input_search.placeholder = "Начните вводить название курса/филиал/фио преподавателя для поиска...";


                            input_search.addEventListener("keyup", () => {
                                let cards = document.querySelector("div[data-region=\"paged-content-page\"]").children[0].childNodes;

                                for (let card of cards) {
                                    if (!(card.textContent.replaceAll("\n", " ").trim().toLowerCase().includes(input_search.value.toLowerCase()))) {
                                        card.hidden = true;
                                    } else {
                                        card.hidden = false;
                                    };
                                };
                            })

                            div_search.appendChild(input_search);

                            place.appendChild(div_search);

                        }

                    })
                });

            })
    })
