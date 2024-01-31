/**
 * @license
 * Copyright 2023 Alexander Podstechnyy
 *
 * This is a part of LMS RANEPA Helper
 *
 */

/**
 * Возвращает тег самого верхнего элемента из переданной разметки
 * @param {string} markup Разметка
 * @returns Выбранный HTML тег
 */
const matchTagName = (markup) => {
  const pattern = /<([^\s>]+)(\s|>)+/;
  return markup.match(pattern)[1];
};

/**
 * Возвращает имена параметров в синтаксисе EJS (`<% paramName1 %>`), найденные в разметке
 * @param {string} markup Разметка
 * @returns `[["<% paramName1 %>", "paramName1"], ...]`
 */
const matchEJSParams = (markup) => {
  const pattern = /<%\ *(\w+)\ *%>/g;
  const matching = [...markup.matchAll(pattern)];
  return matching;
};

const parseHTMLMarkup = (markup) => {
  const _html = document.createElement(this.tagName);
  _html.innerHTML = markup;
  return _html.firstElementChild;
};

class HTMLEJSParams {
  constructor(markup) {
    const pattern = /<%\ *(\w+)\ *%>/g;

    /**
     * @type string[]
     */
    this.tags = [...markup.matchAll(pattern)].map((value) => value[0]);

    /**
     * @type string[]
     */
    this.names = [...markup.matchAll(pattern)].map((value) => value[1]);
  }
}

/**
 * Внедряемый компонент
 */
class HTMLComp {
  /**
   * @param {string} strHtml HTML код компонента
   * @param {{[key: string]: any}} paramsObject Объект, ключи которого являются именами параметров, а значения - значениями. Имена параметров будут заменены на значения. По умолчанию - пустой объект.
   */
  constructor(strHtml, paramsObject = {}) {
    /**
     * Строковый HTML код компонента. В нем заменяются параметры `<% param1 %>`
     * @type string
     */
    this.strHtml = strHtml;
    this.paramsObject = paramsObject;
    /**
     * @type HTMLEJSParams
     */
    this.params = new HTMLEJSParams(this.strHtml);

    // подстановка параметров
    if (Object.keys(paramsObject).length) {
      this.params.tags.forEach((tag, index) => {
        const value = paramsObject[this.params.names[index]];
        value
          ? (this.strHtml = this.strHtml.replace(tag, value))
          : (this.strHtml = this.strHtml.replace(tag, ""));
      });
    }

    this.tagName = matchTagName(this.strHtml);
    /**
     * @type HTMLElement
     */
    this.html = parseHTMLMarkup(this.strHtml);
  }

  /**
   * Вытягивает указанный элемент из разметки и возвращает его как компонент
   * @param {string} selector CSS селектор для тега в HTML
   */
  static querySelector(selector) {
    return new HTMLComp(document.querySelector(selector).innerHTML);
  }

  /**
   * Вставляет текущий компонент в родителя
   * @param {string} parentSelector Родитель, в которого надо вставить этот компонент
   * @param {string} method Метод, с помощью которого вставляем компонент (по умолчанию `appendChild`)
   */
  _injectInto(parentSelector, method = "appendChild") {
    // document.querySelector(parentSelector)[method](this.html);
    HTMLHelper.inject(parentSelector, method);
  }

  /**
   * Устанавливает значение для указанного свойства
   * @param {string} propertyName Имя устанавливаемого свойства
   * @param {string} newValue Значение устанавливаемого свойства
   * @returns Аргумент `newValue`
   */
  set(propertyName, newValue) {
    this.html[propertyName] = newValue;
    this.strHtml = `${this.html.outerHTML}`;
    return newValue;
  }

  /**
   * Возвращает запрашиваемое свойства у компонента. Только для чтения
   * @param {string} propertyName Имя запрашиваемого свойства
   * @returns `string`
   */
  get(propertyName) {
    return this.html[propertyName];
  }
}

/**
 * Позволяет писать компоненты на чистом HTML и внедрять их на страницу
 */
class HTMLHelper {
  constructor() {
    this.author = "tankalxat34";
  }

  /**
   * Вставляет в указанного родителя указанный компонент выбранным методом (по умолчанию `appendChild`)
   * @param {string} parentSelector Родитель, в которого вставляем компонент
   * @param {HTMLComp} component Компонент, который вставляем
   * @param {string} method Метод, с помощью которого вставляем компонент
   */
  static inject(parentSelector, component, method = "appendChild") {
    document.querySelector(parentSelector)[method](component.html);
  }

  /**
   * Асинхронная функция, загружающая HTML разметку из файла компонента
   * @param {string} path Путь до html файла компонента, находящегося внутри расширения
   * @param {object} paramsObject Объект, ключи которого являются именами параметров, а значения - значениями. Имена параметров будут заменены на значения. По умолчанию - пустой объект.
   * @returns экземпляр класса `HTMLComp`
   */
  static async loadComp(path, paramsObject = {}) {
    const modPath = chrome.runtime.getURL(path);
    const result = await fetch(modPath);
    const markup = await result.text();
    return new HTMLComp(markup, paramsObject);
  }
}

/**
 * Возвращает глубокую копию элемента дерева как компонент `HTMLComp`
 * @param {object} paramsObject Объект, ключи которого являются именами параметров, а значения - значениями. Имена параметров будут заменены на значения. По умолчанию - пустой объект.
 * @returns `HTMLComp`
 */
HTMLElement.prototype.getAsComp = function (paramsObject = {}) {
  return new HTMLComp(this.outerHTML, paramsObject);
};

Document.prototype.HTMLComp = HTMLComp;
Document.prototype.HTMLEJSParams = HTMLEJSParams;
Document.prototype.HTMLHelper = HTMLHelper;
