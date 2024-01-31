/**
 * Уведомяет о том, что расширение успешно загружено
 */

console.log("LMS RANEPA Helper has been enabled");

const menu_items_dropdown = [
  {
    title: "Общие настройки",
    href: "https://lms.ranepa.ru/user/preferences.php",
    blank: true,
  },
];

/**
 * Асинхронный запрос к файлу внутри расширения и вернуть его содержимое в виде текста
 *
 * @param {string} path Путь до HTML или файла
 * @returns {string} строка, содержащая текст документа
 */
async function fetchDoc(path) {
  const modPath = chrome.runtime.getURL(path);
  const result = await fetch(modPath);
  return await result.text();
}

/**
 * Заменяет подстроки из первого массива на подстроки из второго массива. Возвращает новую строку
 * @param str исходная строка
 * @param first_array подстроки что заменяем
 * @param second_array подстроки на что заменяем
 * @returns {String}
 */
function translateString(str, first_array, second_array) {
  let result = str;
  for (let i = 0; i < first_array.length; i++) {
    let counter = 0;
    while (result.indexOf(first_array[i]) !== -1) {
      counter++;
      result = result.replace(first_array[i], second_array[i]);
      if (counter >= 1000) break;
    }
  }
  return result;
}

function showAlert(
  text,
  type_of_alert = "info",
  classList = "alert alert-%type_of_alert% alert-block fade in  alert-dismissible"
) {
  html = `${text}
    <button type="button" class="close" data-dismiss="alert">
        <span aria-hidden="true">×</span>
        <span class="sr-only">Отклонить это уведомление</span>
    </button>`;

  div = document.createElement("div");
  div.classList = classList.replace("%type_of_alert%", type_of_alert);
  div.role = "alert";
  div.innerHTML = html;

  document.querySelector("#user-notifications").appendChild(div);
}

function addScript(text, document_place = document.body) {
  /*
        Добавляет скрипт в страницу
    */
  script = document.createElement("script");
  script.innerHTML = text;
  document_place.appendChild(script);
}

function addSrcScriptToEnd(src) {
  _script = document.createElement("script");
  if (!src.includes("http")) {
    _script.src = chrome.runtime.getURL(src);
  } else {
    _script.src = src;
  }
  document.body.appendChild(_script);
}

/**
 * Скачивает переданный текст в текстовый файл
 * @param {string} filename Имя текстового файла
 * @param {string} content Содержимое файла
 */
function downloadFileFromText(filename, content) {
  var a = document.createElement("a");
  var blob = new Blob([content], { type: "text/plain;charset=UTF-8" });
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Добавить скрипт в head
 */
function addSrcScript(src, crossorign = false) {
  var _script = document.createElement("script");
  if (!src.includes("http")) {
    _script.src = chrome.runtime.getURL(src);
  } else {
    _script.src = src;
  }

  try {
    _script.crossorign = !!crossorign;
    document.head.appendChild(_script);
    console.log("Добавлен скрипт", src);
  } catch {
    console.log("❌Ошибка добавления скрипта", src);
  }
}

function addSrcCss(src) {
  _css = document.createElement("link");
  if (!src.includes("http")) {
    _css.href = chrome.runtime.getURL(src);
  } else {
    _css.href = src;
  }
  _css.rel = "stylesheet";
  document.head.appendChild(_css);
}

/**
 * Добавляет кнопку для открытия сервисов LMS RANEPA Helper
 */
function addButtonToServices() {
  let navbar = document.getElementsByClassName("nav-item")[0];

  let btnServices = document.createElement("div");
  btnServices.classList = "popover-region collapsed";

  btnServices.innerHTML = `<i class="fa fa-fw fa-list-ul" aria-hidden="true">`;

  navbar.append(btnServices);
}

function copyToClipboard(element) {
  navigator.clipboard.writeText($(element).val());
}

/**
 * Добавляет новые кнопки в dropdown menu
 */
function addMenuItems() {
  let menu = document.querySelector("#carousel-item-main");

  let dropdown_header = document.createElement("div");
  dropdown_header.innerHTML = `<h5>LMS RANEPA Helper</h5>`;
  dropdown_header.style.margin = "10px 10px 0px";
  menu.before(dropdown_header);

  menu_items_dropdown.forEach((element) => {
    let dropdown_element = document.createElement("a");
    dropdown_element.href = element.href;
    dropdown_element.innerText = element.title;
    dropdown_element.classList += "dropdown-item";
    dropdown_element.setAttribute("role", "menuitem");
    dropdown_element.setAttribute("tabindex", "-1");

    if (element.blank) {
      dropdown_element.setAttribute("target", "_blank");
    }

    menu.before(dropdown_element);
  });

  let sep = document.createElement("div");
  sep.classList = "dropdown-divider";
  menu.before(sep);
}

/**
 * Возвращает путь до front-скрипта по его расположению
 *
 * @param {string} url Строковый url.pathname страницы
 * @returns строку в формате `scripts/%some_path%.font.js`
 */
function getFrontScript(url = new URL(window.location.href).pathname) {
  var result;
  if (url.includes(".php"))
    result = [...url.split("/").slice(1, -1), url.split("/").slice(-1)[0].split(".")[0]];
  else result = url.split("/").slice(1, -1);

  return `scripts/${result.join("/")}.front.js`;
}

/**
 * Возвращает путь до универсального front-скрипта, который будет выполняться на всех страницах в выбранной категории
 * @param {*} url путь к скрипту ufront
 * @returns {string} строку в формате `scripts/%some_path%.ufont.js`
 */
function getUniversalScript(url = new URL(window.location.href).pathname) {
  return `scripts/${url.split("/").slice(1, -1).join("/")}.u.front.js`;
}

/**
 * Возвращает значение по ключу из `sessionStorage`. Таким образом можно получить распарсенную информацию о текущем курсе
 *
 * Работает по принципу: если переданный key является подстрокой одного из существующих ключей в `sessionStorage`, то вернуть значение.
 * @param {string} key Ключ
 * @returns {object}
 */
function getFromSessionStorage(key = "staticState") {
  const session = { ...sessionStorage };

  for (let keyName in session) {
    if (keyName.includes(key)) return JSON.parse(session[keyName]);
  }
  return {};
}

const saveElementToMainPage = async () => {
  const chromeStorageKey = "helper-my-lms-links";
  /**
   * @type object
   */
  const storage = await chrome.storage.sync.get(chromeStorageKey);
  /**
   * @type object[]
   */
  var storageLinks = storage[chromeStorageKey] || [];

  console.log(storageLinks);

  const body = {
    href: window.location.href,
    title: pageTitle,
    courseTitle: document.title,
    id: Date.now(),
  };

  chrome.storage.sync.set(
    {
      "helper-my-lms-links": [...storageLinks, body],
    },
    showAlert("Ссылка на этот элемент сохранена на главную страницу!", "success")
  );

  chrome.storage.sync.get(chromeStorageKey, console.log);
};

const pageTitle = document.querySelector(".page-header-headings > h1").textContent;
const btnSaveToMainPage = new HTMLComp(
  `<button class="btn btn-secondary m-2"><i class="fa-solid fa-floppy-disk"></i></button>`
);
btnSaveToMainPage.html.addEventListener("click", saveElementToMainPage);
document
  .querySelector('div[data-region="header-actions-container"]')
  .appendChild(btnSaveToMainPage.html);

try {
  // common scripts and functions
  addSrcScript("scripts/index.front.js");
  addSrcScript("scripts/_services/drawdown.js");
  addSrcScript("scripts/_services/base64.js");
  addSrcScript("scripts/_libs/html-injector.js");

  addSrcScript(getFrontScript());
  addSrcScript(getUniversalScript());
  addMenuItems();

  // get option names from Chrome Storage
  chrome.storage.sync.get(["_option_names_array"], (options) => {
    var _opt_names = options["_option_names_array"];

    // load all options from Chrome Storage
    chrome.storage.sync.get(_opt_names, (options) => {
      console.log(options);

      if (options["helper-settings-disable_yametrika"]) {
        addSrcScript("scripts/_services/disableYaMetrika.js");
      }
    });
  });
} catch (error) {
  console.log(error);
  null;
}
