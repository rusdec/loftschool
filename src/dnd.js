/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
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
let dragable;

/*
 Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 Функция НЕ должна добавлять элемент на страницу. На страницу элемент добавляется отдельно

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
 */
function createDiv() {
  let div = document.createElement('div');
  let width  = Math.floor(Math.random() * 100) + 15;
  let height = Math.floor(Math.random() * 100) + 15;
  let position = (elementSize, screenSize) => {
    let _position = Math.floor(Math.random() * screenSize) - elementSize;
    return _position < 0 ? 0 : _position;
  };
  let randomColor = (() => {
      let colorCode  = '#';
      let colorChars = ['1','2','3','4','5',
                        '6','7','8','9','0',
                        'a','b','c','d','e','f'];
      for(let i = 0; i < 6; i++) {
        colorCode += colorChars[Math.floor(Math.random() * (colorChars.length - 1))]; 
      }
      return colorCode;
  })();

  div.classList.add('draggable-div');
  div.style.width  = `${width}px`;
  div.style.height = `${height}px`;
  div.style.left  = `${position(width, window.innerWidth)}px`;
  div.style.top   = `${position(height, window.innerHeight)}px`;
  div.style.backgroundColor = randomColor;
  div.draggable = true;
  div.dataset.color = div.style.backgroundColor;
  div.style.position = 'fixed';
  return div;
}

/*
 Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop

 Пример:
   const newDiv = createDiv();
   homeworkContainer.appendChild(newDiv);
   addListeners(newDiv);
 */
function addListeners(target) {
  target.addEventListener('dragstart', function(event) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', event.target);
    dragable = event.target;
  }, false);

  target.addEventListener('dragover', function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, false);

  target.addEventListener('drop', function(event) {
    event.dropEffect = 'move';
    if (event.target !== dragable) {
      event.target.appendChild(dragable);
      dragable.style.position = 'sticky';
    }
  }, false);
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    const div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации D&D
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
  //
});

export {
    createDiv
};
