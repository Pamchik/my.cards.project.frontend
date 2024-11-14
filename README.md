# cards.project.backend

Проект создан на React+TS

Для запуска проекта скачайте:
1. Node.js с официального сайта
2. Python с официального сайта


В текущем проекте установите зависимости:
### `npm install`


Перед запуском проверить config.json в public
1. Для локального использования:
    {
    "WEB_Url": "http://localhost:3000",
    "API_Url": "http://127.0.0.1:8000",
    "emailDomain": "@test.kz"
    }
2. Для prod использовать соответствующие адреса


В текущем проекте запустите:
### `npm start`


Приложение запустится в режиме разработки в браузере:
[http://localhost:3000] 


Для сборки в prod необходимо:
1. Внести изменения в версию сборки
    - Если это серьезное изменение (исправление ошибок) в вашем приложении, используйте:
    ### `npm version major`

    - Если это незначительное изменение (исправление ошибок) в вашем приложении, используйте:
    ### `npm version minor`

    - А если это просто обновление патча, например изменение некоторых стилей, используйте:
    ### `npm version patch`

2. После внесения изменения сделайте сборку:
    ### `npm run build`

