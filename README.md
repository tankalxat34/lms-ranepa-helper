## Описание
В этой ветке реализуется возможность экспорта/импорта ответов в тестах на базе алгоритма Хаффмана (Huffman Algorithm). После окончания работы будет создан merge request в основную ветку [`main`](https://github.com/tankalxat34/lms-ranepa-helper/tree/main).


1. Реализовать функционал без шифрования.
2. Если тесты на больших квизах провалятся - сделать с шифрованием.
3. Сравнивать полученные объекты: если вопросы совпадают - это наш тест, вставляем в него ответы. Иначе - не вставляем.

Для начала будет реализовано решение без `attachments`.

## Экспорт ответов в JSON файл
Концепция решения экспорта ответов:
1. Пользователь нажимает на кнопку "Экспорт ответов в JSON";
2. Расширение формирует хеш-таблицу (js объект) по принципу:
   1. Поле: зашифрованный текст вопроса.
   2. Значение (всегда зашифровано): массив объектов следующей структуры:

```js
{
    "content": "encrypted_text_value_1",
    "value": "encrypted_answertext_value_1", // лучше сохранять в виде строки, так как мы будем собирать значения всех <input> в секции с вариантами ответов.
    "attachments": {
        "img": {
            "src": "encrypted_url_to_answer_image_1"
            // другие важные атрибуты тега img
        }
        // другие теги и их важные значения, которые прикреплены к данному варианту ответа
    }
}
```

3. Полученная структура сохраняется в JSON файл в папку "Downloads" на ПК текущего пользователя.

### Пример

`Наименование теста_ДДММГГГГ_ЧЧММСС.json` содержит:

```json
{
    "encrypted_question_1_text": {
        "answers": [
            {
                "content": "encrypted_text_value_1",
                "value": "encrypted_answertext_value_1",
                "attachments": {
                    "img": {
                        "src": "encrypted_url_to_answer_image_1"
                    }
                }
            },
            {
                "content": "encrypted_text_value_2",
                "value": "encrypted_answertext_value_2",
                "attachments": {
                    "img": {
                        "src": "encrypted_url_to_answer_image_2"
                    },
                    "span": {
                        "innerText": "encrypted_text_text"
                    }
                }
            },
            {
                "content": "encrypted_text_value_3",
                "value": "encrypted_answertext_value_3",
                "attachments": {
                    "img": {
                        "src": "encrypted_url_to_answer_image_3"
                    }
                }
            },
            {
                "content": "encrypted_text_value_4",
                "value": "encrypted_answertext_value_4",
                "attachments": {
                    "img": {
                        "src": "encrypted_url_to_answer_image_4"
                    }
                }
            }            
        ],
        "attachments": {
            "img": {
                "src": "encrypted_url_to_answer_image_4"
            },
            "span": {
                "innerText": "encrypted_text_text"
            }
        }
    }
}
```

## Импорт ответов из JSON файла

1. Пользователь кликает на кнопку.
2. В файлпикере выбирает JSON файл с ответами.
3. Расширение получает данные из JSON файла.
4. Расширение генерирует отчет о текущем тесте в зашифрованном виде.
5. Сравнивать эти объекты. При совпадении вопросов - проставлять ответы. При несовпадении - не вставлять ответы, сообщить об ошибке.