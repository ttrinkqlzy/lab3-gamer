<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>{{ $product->title }} - Геймер.ру</title>
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
    <div class="row">
        <div class="col-md-6">
            @if($product->image)
                <img src="{{ asset('storage/' . $product->image) }}" class="img-fluid rounded" alt="{{ $product->title }}" title="{{ $product->title }}">
            @else
                <div class="bg-secondary text-white d-flex align-items-center justify-content-center rounded" style="height: 300px;">
                    Нет фото
                </div>
            @endif
        </div>
        <div class="col-md-6">
            <span class="badge bg-dark mb-2">{{ $product->type }}</span>
            <h1 class="page-title">{{ $product->title }}</h1>
            <p class="text-muted">Дата релиза: {{ $product->released_at_formatted }}</p>
            <p>{{ $product->short_desc }}</p>
            <hr>
            <p>{{ $product->full_desc }}</p>
            <p><strong>Подсказка:</strong> {{ $product->hint_word }} — {{ $product->hint_text }}</p>

            <div class="d-flex flex-wrap gap-2 mt-4">
                <a href="{{ route('products.edit', $product) }}" class="btn btn-primary">Изменить</a>
                <a href="{{ route('products.index') }}" class="btn btn-secondary">Назад</a>
                <form action="{{ route('products.destroy', $product) }}" method="POST" onsubmit="return confirm('Удалить товар?')" class="d-flex">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger">Удалить</button>
                </form>
            </div>
        </div>
    </div>
</div>

</body>
</html>