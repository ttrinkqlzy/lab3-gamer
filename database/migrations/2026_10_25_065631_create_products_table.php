<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // тип: "Игровая мышь", "Клавиатура"...
            $table->string('title'); // название товара
            $table->string('short_desc'); // краткое описание
            $table->text('full_desc'); // полное описание
            $table->string('hint_word'); // слово-подсказка
            $table->string('hint_text'); // текст подсказки
            $table->string('image')->nullable(); // путь к картинке (может быть пустым)
            $table->date('released_at'); // дата релиза — для мутатора
            $table->softDeletes(); // для мягкого удаления (расшир. уровень)
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
