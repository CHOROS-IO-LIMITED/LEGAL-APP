<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Middleware\AdminMiddleware;

Route::middleware(AdminMiddleware::class)
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/my-products', [AdminProductController::class, 'index'])
            ->name('my-products');
    });
