/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
  return new Promise((resolve, reject) => {
    fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
      .then(response => response.json())
      .then(towns => resolve(towns.sort((townA, townB) => townA.name > townB.name ? 1 : -1)))
      .catch(() => reject());
  });
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
  return full.match(new RegExp(chunk, 'i')) ? true : false;
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock  = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput  = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');
/* Ллок с негативным результатом загрузки */
const errorBlock   =  homeworkContainer.querySelector('#error-block');  

const elementShow = element => element.style.display = 'block';
const elementHide = element => element.style.display = 'none';

let towns = [];
let townItems = document.createDocumentFragment();

function townItem(townName) {
  let town = document.createElement('div');
  town.innerText = townName;
  return town;
}

function loading() {
  elementShow(loadingBlock);
  elementHide(errorBlock);
  elementHide(filterBlock);

  loadTowns()
    .then(loadedTowns => {
      towns = loadedTowns;
      elementShow(filterBlock);
      elementHide(loadingBlock);
    })
    .catch(() => {
      elementShow(errorBlock);
      elementHide(loadingBlock);
    });
}

homeworkContainer.querySelector('#repeat-loading').onclick = () => loading();

filterInput.addEventListener('keyup', function() {
  filterResult.innerHTML = '';
  if (!filterInput.value.length) {
    return;
  }

  for(let town of towns) {
    if (isMatching(town.name, filterInput.value)) {
      townItems.appendChild(townItem(town.name));
    }
  }

  filterResult.appendChild(townItems);
});

loading();

export {
    loadTowns,
    isMatching
};
