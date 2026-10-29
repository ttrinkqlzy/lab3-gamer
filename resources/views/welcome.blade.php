<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Геймер.ру - Лабораторная №3</title>
  <link rel="stylesheet" href="{{ asset('css/main.css') }}">
  <script src="{{ asset('js/main.js') }}" defer></script>
</head>
<body>

<nav class="navbar navbar-expand-lg gamer-navbar container">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
      <span class="brand-icon">🛒</span>Геймер.ру
    </a>
    <div class="d-flex gap-2">
      <button class="btn btn-load" id="loadBtn">Загрузить</button>
      <button class="btn btn-primary" id="orderBtn">Оформить заказ</button>
    </div>
  </div>
</nav>

<div class="container my-5">
  <h1 class="page-title mb-4">Геймер.ру: устройства для чемпионов</h1>
  <div class="row g-4" id="cardsRow"></div>
</div>

<div class="modal fade" id="infoModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalTitle"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
      </div>
      <div class="modal-body">
        <img id="modalImage" class="img-fluid rounded mb-3" alt="">
        <p id="modalText"></p>
        <p class="text-muted small mb-0">
          Нажмите <kbd>←</kbd> или <kbd>→</kbd>, чтобы переключиться.
        </p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="prevBtn" aria-label="Предыдущий">←</button>
        <button class="btn btn-secondary" id="nextBtn" aria-label="Следующий">→</button>
        <button class="btn btn-primary" data-bs-dismiss="modal">Закрыть</button>
      </div>
    </div>
  </div>
</div>

<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="loadToast" class="toast" role="alert" aria-live="assertive">
    <div class="toast-header">
      <i class="fas fa-spinner fa-spin text-primary me-2"></i>
      <strong class="me-auto">Загрузка</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
    </div>
    <div class="toast-body">
      Функционал загрузки на текущий момент недоступен.
    </div>
  </div>
</div>

<footer class="container gamer-footer py-4 text-center mt-5">
  <span>Сделала: Мельник Анастасия Владимировна</span>
</footer>

</body>
</html>