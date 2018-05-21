/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации
 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
 - имя
 - значение
 - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
 - имя
 - значение
 - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 Пример:
 const newDiv = document.createElement('div');
 homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

window.addEventListener('load', () => {
    refreshCookie();
});

const refreshCookie = () => {

    listTable.innerHTML = '';

    const cookies = getCurrentCookies();
    const chunk = filterNameInput.value;

    let filteredCookies = !chunk ?
            cookies :
            cookies.filter(i => isMatching(i.name, i.value, chunk));
    let fragment = document.createDocumentFragment();

    for (const item of filteredCookies) {
        fragment.appendChild(createCookieRow(item))
    }

    listTable.appendChild(fragment);
};

// function getCurrentCookies() {
//     return document.cookie.split('; ').reduce((prev, current) => {
//         const [name, value]= current.split('=');
//         prev[name] = value;
//         return prev;
//     }, {})
// }

const getCurrentCookies = () => {
    return document.cookie.split('; ').map(item => {
        const [name, value]= item.split('=');
        let result = {};

        result.name = name;
        result.value = value;

        return result;
    });
};

const createCookieRow = item => {
    let row = document.createElement('TR');
    const name = document.createElement('TD');
    const value = document.createElement('TD');
    const buttonContainer = document.createElement('TD');
    const button = document.createElement('BUTTON');

    name.innerText = item.name;
    value.innerText = item.value;
    button.innerText = 'удалить';
    buttonContainer.appendChild(button);

    row.appendChild(name);
    row.appendChild(value);
    row.appendChild(buttonContainer);

    return row;
};

const isMatching = (name, value, chunk) => {
    return (name.toLowerCase().indexOf(chunk.toLowerCase()) >= 0) ||
            (value.toLowerCase().indexOf(chunk.toLowerCase()) >= 0);
};

listTable.addEventListener('click', e => {
    if (e.target.tagName != 'BUTTON') {
        e.preventDefault();

        return;
    }

    const row = e.target.closest('tr');
    const name = row.children[0].innerText;

    deleteCookie(name);
    listTable.removeChild(row);
});

filterNameInput.addEventListener('keyup', () => refreshCookie());

addButton.addEventListener('click', () => {
    const name = addNameInput.value;
    const value = addValueInput.value;

    if (!name) {
        return;
    }

    document.cookie = `${name}=${value}`;
    refreshCookie();

    // addNameInput.value = '';
    // addValueInput.value = '';
});

const deleteCookie = name => document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';