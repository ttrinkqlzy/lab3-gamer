<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Геймер.ру - Товары</title>
    <link rel="stylesheet" href="{{ asset('css/main.css') }}">
</head>
<body>

<nav class="navbar navbar-expand-lg gamer-navbar container">
    <div class="container-fluid">
        <a class="navbar-brand" href="{{ route('products.index') }}">
            <span class="brand-icon">🛒</span>Геймер.ру
        </a>
        <div class="d-flex gap-2">
            <a href="{{ route('products.create') }}" class="btn btn-primary">Добавить товар</a>
        </div>
    </div>
</nav>

<div class="container my-5">
    <h1 class="page-title mb-4">Геймер.ру: устройства для чемпионов</h1>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if($products->isEmpty())
        <p class="text-muted">Пока нет товаров. Добавьте первый!</p>
    @else
        <div class="row g-4">
            @foreach($products as $product)
                <div class="col-12 col-sm-6 col-lg-4">
                    <div class="card product-card h-100">
                        <div class="card-img-wrapper">
                            @if($product->image)
                                <img src="{{ asset('storage/' . $product->image) }}" class="card-img-top" alt="{{ $product->title }}" title="{{ $product->title }}">
                            @else
                                <div class="card-img-top bg-secondary d-flex align-items-center justify-content-center text-white">
                                    Нет фото
                                </div>
                            @endif
                            <span class="card-type">{{ $product->type }}</span>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">{{ $product->title }}</h5>
                            <p class="card-text small flex-grow-1">{{ $product->short_desc }}</p>
                            <p class="text-muted small mb-2">Дата релиза: {{ $product->released_at_formatted }}</p>
                            <div class="d-flex flex-wrap gap-2 mt-auto">
                                <a href="{{ route('products.show', $product) }}" class="btn btn-primary btn-sm flex-grow-1">Подробнее</a>
                                <a href="{{ route('products.edit', $product) }}" class="btn btn-outline-secondary btn-sm flex-grow-1">Изменить</a>
                                <form action="{{ route('products.destroy', $product) }}" method="POST" onsubmit="return confirm('Удалить товар?')" class="flex-grow-1 d-flex">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm w-100">Удалить</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</div>

<footer class="container gamer-footer py-4 text-center mt-5">
    <span>Сделала: Мельник Анастасия Владимировна</span>
</footer>

</body>
</html>