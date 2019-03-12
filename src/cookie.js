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

class Cookie {
  constructor(params) {
    this.name = params.name.trim();
    this.value = params.value.trim();
  }

  toDeletedString() {
    return `${this.name}=; expires=${new Date(0)};`;
  }

  toString() {
    return `${this.name}=${this.value}`;
  }

  get isValid() {
    return this.name.length > 0;
  }
}

class DocumentCookie {
  addCookie(cookie) {
    cookie.isValid ? document.cookie = cookie.toString() : false;
  }

  deleteCookie(cookie) {
    document.cookie = cookie.toDeletedString();
  }

  getCookies() {
    return document.cookie.split(';').reduce((cookies, cookie) => {
      cookies.push(this._parseCookie(cookie));
      return cookies;
    }, []);
  }

  _parseCookie(cookie) {
    let [name, ...value] = cookie.split('=');
    value = value.join('=');
    return new Cookie({name, value});
  }
}

class CookieTable {
  constructor(params) {
    this._table = params.table;
    this._filter = params.filter;
    this._ondeleteHandler = params.ondeleteHandler || function(){};
  }

  filter(cookies) {
    this._table.innerHTML = '';
    cookies.forEach((cookie) => {
      if (this._isFilterPass(cookie)) {
        this._addCookie(cookie);
      }
    });
  }

  _isFilterPass(cookie) {
    return cookie.name.match(this._pattern) || cookie.value.match(this._pattern);
  }

  _addCookie(cookie) {
    let tr = document.createElement('tr');
    let tdName  = document.createElement('td');
    let tdValue = document.createElement('td');
    let tdDelete = document.createElement('td');
    let buttonDelete = document.createElement('button');

    tdName.innerText = cookie.name;
    tdValue.innerText = cookie.value;
    buttonDelete.textContent = 'x';
    tdDelete.appendChild(buttonDelete);
    buttonDelete.addEventListener('click', () => {
      this._ondeleteHandler(cookie);
      tr.remove();
    });
    [tdName, tdValue, tdDelete].forEach((tag) => tr.appendChild(tag));
    this._table.appendChild(tr);
  }

  get _pattern() {
    return new RegExp(this._filter.value); 
  }

}

const documentCookie   = new DocumentCookie; 
const cookieTable      = new CookieTable({
  table: listTable,
  filter: filterNameInput,
  ondeleteHandler: (cookie) => documentCookie.deleteCookie(cookie)
});

cookieTable.filter(documentCookie.getCookies());

filterNameInput.addEventListener('keyup', function() {
  // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
  cookieTable.filter(documentCookie.getCookies())
});


addButton.addEventListener('click', () => {
  // здесь можно обработать нажатие на кнопку "добавить cookie"
  documentCookie.addCookie(new Cookie({
    name: addNameInput.value,
    value: addValueInput.value
  }));
  cookieTable.filter(documentCookie.getCookies())

  addNameInput.value  = '';
  addValueInput.value = '';
});
