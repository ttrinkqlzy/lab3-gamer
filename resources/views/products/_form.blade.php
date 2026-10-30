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
    <select name="type" id="type" class="form-select" required data-validate="required">
        <option value="" disabled {{ old('type', $product->type ?? '') ? '' : 'selected' }}>— Выберите тип —</option>
        @foreach(['Игровая мышь', 'Механическая клавиатура', 'Игровой коврик'] as $type)
            <option value="{{ $type }}"
                {{ old('type', $product->type ?? '') === $type ? 'selected' : '' }}>
                {{ $type }}
            </option>
        @endforeach
    </select>
</div>

<div class="mb-3">
    <label for="title" class="form-label">Название</label>
    <input type="text" name="title" id="title" class="form-control" required
           data-validate="required|pattern:^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$|min:3|max:255"
           data-pattern-message="Только буквы, цифры, пробелы и дефис"
           value="{{ old('title', $product->title ?? '') }}">
</div>

<div class="mb-3">
    <label for="short_desc" class="form-label">Краткое описание</label>
    <input type="text" name="short_desc" id="short_desc" class="form-control" required data-validate="required|max:255"
           value="{{ old('short_desc', $product->short_desc ?? '') }}">
</div>

<div class="mb-3">
    <label for="full_desc" class="form-label">Полное описание</label>
    <textarea name="full_desc" id="full_desc" class="form-control" rows="4" required data-validate="required">{{ old('full_desc', $product->full_desc ?? '') }}</textarea>
</div>

<div class="row">
    <div class="col-md-6 mb-3">
        <label for="hint_word" class="form-label">Слово-подсказка</label>
        <input type="text" name="hint_word" id="hint_word" class="form-control" required
               data-validate="required|pattern:^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$|max:255"
               data-pattern-message="Только буквы, цифры, пробелы и дефис"
               value="{{ old('hint_word', $product->hint_word ?? '') }}">
    </div>
    <div class="col-md-6 mb-3">
        <label for="hint_text" class="form-label">Текст подсказки</label>
        <input type="text" name="hint_text" id="hint_text" class="form-control" required data-validate="required|max:255"
               value="{{ old('hint_text', $product->hint_text ?? '') }}">
    </div>
</div>

<div class="mb-3">
    <label for="released_at" class="form-label">Дата релиза</label>
    <input type="date" name="released_at" id="released_at" class="form-control" required
        max="{{ date('Y-m-d') }}"
        data-validate="required|not-future"
        data-future-message="Дата релиза не может быть в будущем"
        value="{{ old('released_at', isset($product) ? $product->released_at->format('Y-m-d') : '') }}">
</div>

<div class="mb-3">
    <label for="image" class="form-label">Картинка</label>
    <input type="file" name="image" id="image" class="form-control" accept="image/jpeg,image/png,image/gif,image/webp">
    <div class="form-text">
        Принимаются: <strong>JPG, PNG, GIF, WEBP</strong>.
        Максимальный размер: <strong>2 МБ</strong>.
        Рекомендуемый размер: <strong>600×400 пикселей</strong> (картинка будет уменьшена автоматически).
    </div>
    @if(isset($product) && $product->image)
        <small class="text-muted">Текущая картинка: {{ $product->image }}</small>
    @endif
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (!form) return;

    const fields = form.querySelectorAll('[data-validate]');

    fields.forEach(field => {
        //проверка при уходе с поля
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) validateField(field);
        });
        field.addEventListener('change', () => {
            if (field.classList.contains('is-invalid')) validateField(field);
        });
    });

    form.addEventListener('submit', function (e) {
        let hasError = false;
        fields.forEach(field => {
            validateField(field);
            if (field.classList.contains('is-invalid')) hasError = true;
        });
        if (hasError) {
            e.preventDefault();
            const firstError = form.querySelector('.is-invalid');
            if (firstError) firstError.focus();
        }
    });

    function validateField(field) {
        const value = (field.value || '').trim();
        const rules = (field.dataset.validate || '').split('|');
        let error = '';

        for (const rule of rules) {
            if (rule === 'required' && value === '') {
                error = 'Поле обязательно для заполнения';
                break;
            }
            if (rule.startsWith('pattern:')) {
                const pattern = new RegExp(rule.substring(8));
                if (value !== '' && !pattern.test(value)) {
                    error = field.dataset.patternMessage || 'Недопустимые символы';
                    break;
                }
            }
            if (rule.startsWith('min:')) {
                const min = parseInt(rule.substring(4));
                if (value !== '' && value.length < min) {
                    error = `Минимум ${min} символов`;
                    break;
                }
            }
            if (rule.startsWith('max:')) {
                const max = parseInt(rule.substring(4));
                if (value.length > max) {
                    error = `Максимум ${max} символов`;
                    break;
                }
            }
            if (rule === 'not-future') {
                if (value !== '') {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const chosen = new Date(value);
                    if (chosen > today) {
                        error = field.dataset.futureMessage || 'Дата не может быть в будущем';
                        break;
                    }
                }
            }
        }

        if (error) {
            field.classList.add('is-invalid');
            let feedback = field.parentElement.querySelector('.invalid-feedback');
            if (!feedback) {
                feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                field.parentElement.appendChild(feedback);
            }
            feedback.textContent = error;
        } else {
            field.classList.remove('is-invalid');
            const feedback = field.parentElement.querySelector('.invalid-feedback');
            if (feedback) feedback.textContent = '';
        }
    }
});
</script>