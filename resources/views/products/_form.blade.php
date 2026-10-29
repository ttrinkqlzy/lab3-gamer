{{-- Вывод ошибок валидации --}}
@if($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="mb-3">
    <label for="type" class="form-label">Тип товара</label>
    <input type="text" name="type" id="type" class="form-control" required
           value="{{ old('type', $product->type ?? '') }}">
</div>

<div class="mb-3">
    <label for="title" class="form-label">Название</label>
    <input type="text" name="title" id="title" class="form-control" required
           value="{{ old('title', $product->title ?? '') }}">
</div>

<div class="mb-3">
    <label for="short_desc" class="form-label">Краткое описание</label>
    <input type="text" name="short_desc" id="short_desc" class="form-control" required
           value="{{ old('short_desc', $product->short_desc ?? '') }}">
</div>

<div class="mb-3">
    <label for="full_desc" class="form-label">Полное описание</label>
    <textarea name="full_desc" id="full_desc" class="form-control" rows="4" required>{{ old('full_desc', $product->full_desc ?? '') }}</textarea>
</div>

<div class="row">
    <div class="col-md-6 mb-3">
        <label for="hint_word" class="form-label">Слово-подсказка</label>
        <input type="text" name="hint_word" id="hint_word" class="form-control" required
               value="{{ old('hint_word', $product->hint_word ?? '') }}">
    </div>
    <div class="col-md-6 mb-3">
        <label for="hint_text" class="form-label">Текст подсказки</label>
        <input type="text" name="hint_text" id="hint_text" class="form-control" required
               value="{{ old('hint_text', $product->hint_text ?? '') }}">
    </div>
</div>

<div class="mb-3">
    <label for="released_at" class="form-label">Дата релиза</label>
    <input type="date" name="released_at" id="released_at" class="form-control" required
           value="{{ old('released_at', isset($product) ? $product->released_at->format('Y-m-d') : '') }}">
</div>

<div class="mb-3">
    <label for="image" class="form-label">Картинка</label>
    <input type="file" name="image" id="image" class="form-control" accept="image/*">
    @if(isset($product) && $product->image)
        <small class="text-muted">Текущая картинка: {{ $product->image }}</small>
    @endif
</div>