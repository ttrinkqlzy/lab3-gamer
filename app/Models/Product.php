<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Поля, которые разрешено массово заполнять
     */
    protected $fillable = [
        'type',
        'title',
        'short_desc',
        'full_desc',
        'hint_word',
        'hint_text',
        'image',
        'released_at',
    ];

    /**
     * released_at автоматически станет объектом Carbon
     * мутатор для даты в Laravel
     */
    protected $casts = [
        'released_at' => 'date',
    ];

    /**
     * мутатор для чтения форматирует дату в читаемый вид
     * $product->released_at_formatted
     */
    public function getReleasedAtFormattedAttribute(): string
    {
        return $this->released_at
            ? Carbon::parse($this->released_at)->format('d.m.Y')
            : '-';
    }
}