<?php

use App\Http\Controllers\Web\ProductController;
use App\Http\Controllers\Web\ProductDetailsController;
use Illuminate\Support\Facades\Route;

// public route
Route::get('/products', [ProductController::class, 'index'])->name('products');

// product detail with optional index parameter
Route::get('/products/details/{index?}', [ProductDetailsController::class, 'index'])->name('product.details');