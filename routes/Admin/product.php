<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminDocumentController;
use App\Http\Middleware\AdminMiddleware;

Route::middleware(AdminMiddleware::class)
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/my-products', [AdminProductController::class, 'index'])->name('my-products');

        Route::post('/documents', [AdminDocumentController::class, 'store'])->name('documents.store');
        Route::put('/documents/{document}', [AdminDocumentController::class, 'update'])->name('documents.update');
        Route::delete('/documents/{document}', [AdminDocumentController::class, 'destroy'])->name('documents.destroy');
    });
