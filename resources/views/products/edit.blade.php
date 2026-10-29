<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Редактировать - {{ $product->title }}</title>
    <link rel="stylesheet" href="{{ asset('css/main.css') }}">
</head>
<body>

<nav class="navbar navbar-expand-lg gamer-navbar container">
    <div class="container-fluid">
        <a class="navbar-brand" href="{{ route('products.index') }}">
            <span class="brand-icon">🛒</span>Геймер.ру
        </a>
        <a href="{{ route('products.index') }}" class="btn btn-load">← На главную</a>
    </div>
</nav>

<div class="container my-5">
    <h1 class="page-title mb-4">Редактировать: {{ $product->title }}</h1>

    <form action="{{ route('products.update', $product) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        @include('products._form')

        <button type="submit" class="btn btn-primary">Обновить</button>
        <a href="{{ route('products.index') }}" class="btn btn-secondary">Отмена</a>
    </form>
</div>

</body>
</html>