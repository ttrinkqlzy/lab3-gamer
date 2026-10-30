//подключение иконок fontawesome
import '@fortawesome/fontawesome-free/css/all.min.css';

//подключение bootstrap как модуля
import * as bootstrap from 'bootstrap';

//подключение картинок через импорт, чтобы webpack их скопировал
import imgLogitech from '../images/logitech-gpro.jpg';
import imgRazerViper from '../images/razer-viper.jpg';
import imgHyperX from '../images/hyperx-alloy.jpg';
import imgSteelSeries from '../images/steelseries-apex.jpg';
import imgRazerGoliathus from '../images/razer-goliathus.jpg';

//данные товаров
const products = [
  {
    img: imgLogitech,
    type: 'Игровая мышь',
    title: 'Logitech G Pro X Superlight',
    shortDesc: 'Сенсор HERO 25K, вес 63 г.',
    fullDesc: 'Беспроводная игровая мышь с сенсором HERO 25K. Ускорение до 40 G, вес всего 63 грамма. Идеальна для шутеров.',
    hintWord: 'HERO 25K', //слово, которое станет подсказкой
    hintText: 'Оптический сенсор с максимальным разрешением 25 600 DPI'
  },
  { img: imgRazerViper, type: 'Игровая мышь', title: 'Razer Viper V2 Pro',
    shortDesc: 'Сенсор Focus Pro 30K, вес 58 г.',
    fullDesc: 'Симметричная беспроводная мышь с сенсором Focus Pro 30K. Ускорение 70 G, вес 58 грамм.',
    hintWord: 'Focus Pro 30K', hintText: 'Сенсор с разрешением 30 000 DPI' },
  { img: imgHyperX, type: 'Механическая клавиатура', title: 'HyperX Alloy Origins 60',
    shortDesc: 'Переключатели HyperX Red, форм-фактор 60%.',
    fullDesc: 'Компактная механическая клавиатура формата 60%. Переключатели HyperX Red, кейкапы PBT double-shot. Вес 780 г.',
    hintWord: 'HyperX Red', hintText: 'Линейные механические переключатели без тактильной отдачи' },
  { img: imgSteelSeries, type: 'Механическая клавиатура', title: 'SteelSeries Apex Pro TKL',
    shortDesc: 'Аналоговые переключатели OmniPoint.',
    fullDesc: 'Клавиатура с настраиваемыми аналоговыми переключателями OmniPoint. Регулируемая точка срабатывания, вес 900 г.',
    hintWord: 'OmniPoint', hintText: 'Точка срабатывания от 0.4 до 3.6 мм' },
  { img: imgRazerGoliathus, type: 'Игровой коврик', title: 'Razer Goliathus Chroma Extended',
    shortDesc: 'Размер 940×410 мм, тканевый.',
    fullDesc: 'Расширенный игровой коврик 940×410×4 мм. Тканевое покрытие, прошитый край, подсветка Chroma RGB.',
    hintWord: 'Chroma', hintText: 'Подсветка Razer с 16.8 млн цветов' }
];

//генерация карточек
//классы col-12 col-sm-6 col-lg-4 из сетки bootstrap
//классы card, card-body, card-title из компонента card
const row = document.getElementById('cardsRow');
products.forEach((p, idx) => {
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-lg-4'; //адаптив 1/2/3 колонки
  col.innerHTML = `
    <div class="card product-card h-100">
      <div class="card-img-wrapper">
        <img src="${p.img}" class="card-img-top" alt="${p.title}" title="${p.title}">
        <span class="card-type">${p.type}</span>
      </div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${p.title}</h5>
        <p class="card-text small flex-grow-1">${p.shortDesc}</p>
        <button class="btn btn-primary btn-sm mt-2" data-index="${idx}">Подробнее</button>
      </div>
    </div>
  `;
  row.appendChild(col);
});

//инициализация модалки
const modalEl = document.getElementById('infoModal');
const modal = new bootstrap.Modal(modalEl);
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalText = document.getElementById('modalText');

let currentIndex = 0; //номер открытого товара
let currentPopover = null; //ссылка на активный popover

//функция заполняет модалку товаром под номером i
function renderModal(i) {
  //зацикливаем индекс, чтобы не выйти за границы массива
  currentIndex = (i + products.length) % products.length;
  const p = products[currentIndex];

  //уничтожаем старый popover, иначе они накопятся
  if (currentPopover) { currentPopover.dispose(); currentPopover = null; }

  modalTitle.textContent = p.title;
  modalImage.src = p.img;
  modalImage.alt = p.title; 
  modalImage.title = p.title; 

  
  //popover через bootstrap
  //оборачиваем слово-подсказку в span с атрибутами data-bs
  modalText.innerHTML = p.fullDesc.replace(
    p.hintWord,
    `<span class="hint" tabindex="0"
      data-bs-toggle="popover"
      data-bs-content="${p.hintText}">${p.hintWord}</span>`
  );

  const hintEl = modalText.querySelector('.hint');
  if (hintEl) {
    currentPopover = new bootstrap.Popover(hintEl, {
      trigger: 'click', //открывается по клику
      placement: 'top', //сверху от слова
      container: 'body' //вынести в body, чтобы не обрезался рамкой модалки
    });
  }
}

//открытие модалки по кнопке подробнее
document.querySelectorAll('[data-index]').forEach(btn => {
  btn.addEventListener('click', () => {
    renderModal(Number(btn.dataset.index)); //берём номер из data-index
    modal.show();
  });
});

//кнопки-стрелки внутри модалки
document.getElementById('prevBtn').addEventListener('click', () => renderModal(currentIndex - 1));
document.getElementById('nextBtn').addEventListener('click', () => renderModal(currentIndex + 1));

//переключение стрелками клавиатуры РУ
document.addEventListener('keydown', (e) => {
  if (!modalEl.classList.contains('show')) return; //только если модалка открыта
  if (e.key === 'ArrowLeft') renderModal(currentIndex - 1);
  if (e.key === 'ArrowRight') renderModal(currentIndex + 1);
});

//тост
//autohide false, чтобы иконка крутилась бесконечно
const toastEl = document.getElementById('loadToast');
const toast = new bootstrap.Toast(toastEl, { autohide: false });

document.getElementById('loadBtn').addEventListener('click', () => toast.show());

//заглушка для кнопки оформить заказ
document.getElementById('orderBtn').addEventListener('click', () => {
  alert('Спасибо за интерес! Менеджер свяжется с вами в течение 15 минут.');
});