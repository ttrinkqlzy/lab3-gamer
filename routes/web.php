<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

//главная страница список товаров
Route::get('/', [ProductController::class, 'index'])->name('products.index');

//CRUD-маршруты без index т.к. он уже есть на главной
Route::resource('products', ProductController::class)->except(['index']);