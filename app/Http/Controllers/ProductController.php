<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    //список всех товаров (главная страница)
    public function index()
    {
        $products = Product::orderBy('id', 'desc')->get();
        return view('products.index', compact('products'));
    }

    //форма создания нового товара
    public function create()
    {
        return view('products.create');
    }

    //сохранение нового товара из формы
    public function store(Request $request)
    {
        $validated = $this->validateProduct($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->saveResizedImage($request->file('image'));
        }

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Товар успешно добавлен');
    }

    //детальная страница товара
    public function show(Product $product)
    {
        return view('products.show', compact('product'));
    }

    //форма редактирования
    public function edit(Product $product)
    {
        return view('products.edit', compact('product'));
    }

    //обновление товара
    public function update(Request $request, Product $product)
    {
        $validated = $this->validateProduct($request);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $this->saveResizedImage($request->file('image'));
        }

        $product->update($validated);

        return redirect()->route('products.index')
            ->with('success', 'Товар обновлён');
    }

    //мягкое удаление товара
    public function destroy(Product $product)
    {
        $product->delete(); //SoftDeletes запись остаётся но помечается deleted_at
        return redirect()->route('products.index')
            ->with('success', 'Товар удалён');
    }

    //правила валидации
    private function validateProduct(Request $request): array
    {
        return $request->validate([
            'type' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'short_desc' => 'required|string|max:255',
            'full_desc' => 'required|string',
            'hint_word' => 'required|string|max:255',
            'hint_text' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048', //до 2 МБ
            'released_at'=> 'required|date',
        ], [
            //сообщения об ошибках
            'type.required' => 'Укажите тип товара',
            'title.required' => 'Укажите название',
            'short_desc.required' => 'Заполните краткое описание',
            'full_desc.required' => 'Заполните полное описание',
            'hint_word.required' => 'Укажите слово-подсказку',
            'hint_text.required' => 'Укажите текст подсказки',
            'image.image' => 'Файл должен быть изображением',
            'image.max' => 'Картинка не должна превышать 2 МБ',
            'released_at.required'=> 'Укажите дату релиза',
            'released_at.date' => 'Введите корректную дату',
        ]);
    }
    /**
     * сохраняет картинку с изменением размера (600×400, пропорционально)
     * возвращает относительный путь внутри storage/app/public
     */
    private function saveResizedImage($file, string $folder = 'products', int $maxWidth = 600, int $maxHeight = 400): string
    {
        $mime = $file->getMimeType();

        //определяем, чем открывать картинку
        $source = match ($mime) {
            'image/jpeg', 'image/jpg' => imagecreatefromjpeg($file->getRealPath()),
            'image/png' => imagecreatefrompng($file->getRealPath()),
            'image/gif' => imagecreatefromgif($file->getRealPath()),
            'image/webp' => imagecreatefromwebp($file->getRealPath()),
            default => null,
        };

        //если формат не поддерживается сохраняем как есть
        if (!$source) {
            return $file->store($folder, 'public');
        }

        $srcW = imagesx($source);
        $srcH = imagesy($source);

        //вычисляем новые размеры с сохранением пропорций
        $ratio = min($maxWidth / $srcW, $maxHeight / $srcH, 1); // 1 не увеличиваем маленькие картинки
        $newW = (int) round($srcW * $ratio);
        $newH = (int) round($srcH * $ratio);

        //создаём пустое изображение нужного размера
        $dest = imagecreatetruecolor($newW, $newH);

        //сохраняем прозрачность для PNG
        if ($mime === 'image/png') {
            imagealphablending($dest, false);
            imagesavealpha($dest, true);
        }

        //копируем и масштабируем
        imagecopyresampled($dest, $source, 0, 0, 0, 0, $newW, $newH, $srcW, $srcH);

        //генерируем имя файла и путь
        $extension = $file->getClientOriginalExtension() ?: 'jpg';
        $filename = uniqid('product_', true) . '.' . $extension;
        $relativePath = $folder . '/' . $filename;
        $fullPath = storage_path('app/public/' . $relativePath);

        //создаём папку, если её нет
        if (!is_dir(dirname($fullPath))) {
            mkdir(dirname($fullPath), 0755, true);
        }

        //сохраняем файл в нужном формате
        match ($mime) {
            'image/jpeg', 'image/jpg' => imagejpeg($dest, $fullPath, 85),
            'image/png'               => imagepng($dest, $fullPath),
            'image/gif'               => imagegif($dest, $fullPath),
            'image/webp'              => imagewebp($dest, $fullPath, 85),
        };

        //освобождаем память
        imagedestroy($source);
        imagedestroy($dest);

        return $relativePath;
    }
}