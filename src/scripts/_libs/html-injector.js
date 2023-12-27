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
    const pattern = /<([^\s>]+)(\s|>)+/
    return markup.match(pattern)[1]
}

const matchParams = (markup) => {
    const pattern = /<%\ *(\w+)\ *%>/g;

}


const parseHTMLMarkup = (markup) => {
    const _html = document.createElement(this.tagName);
    _html.innerHTML = markup;
    return _html.firstElementChild;
}

/**
 * Внедряемый компонент
 */
class HTMLComp {
    /**
     * 
     * @param {string} strHtml HTML код компонента
     */
    constructor(strHtml) {
        /**
         * Строковый HTML код компонента
         */
        this.strHtml = strHtml;
        this.tagName = matchTagName(strHtml);
        this.html = parseHTMLMarkup(strHtml);
        // const _html = document.createElement(this.tagName);
        // _html.innerHTML = strHtml;
        // this.html = _html.firstElementChild;
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
     * @param {string} method Метод, с помощью которого вставляем компонент
     */
    _injectInto(parentSelector, method = "appendChild") {
        document.querySelector(parentSelector)[method](this.html);
    }

    /**
     * Устанавливает значение для указанного свойства
     * @param {string} propertyName Имя устанавливаемого свойства
     * @param {string} newValue Значение устанавливаемого свойства
     * @returns Аргумент `newValue`
     */
    set(propertyName, newValue) {
        this.html[propertyName] = newValue;
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
}