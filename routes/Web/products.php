<?php

use App\Http\Controllers\Web\ProductController;
use Illuminate\Support\Facades\Route;


// public route
Route::get('/products', [ProductController::class, 'index'])->name('products');
