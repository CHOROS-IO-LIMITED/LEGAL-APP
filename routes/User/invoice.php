<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserInvoiceController;
use App\Http\Middleware\UserMiddleware;

Route::middleware(UserMiddleware::class)
    ->prefix('user')
    ->name('user.')
    ->group(function () {

        Route::get('/invoice', [UserInvoiceController::class, 'index'])
            ->name('invoice');
    });
