<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Middleware\GuestMiddleware;

Route::prefix('admin')
    ->name('admin.')
    ->middleware(GuestMiddleware::class)
    ->group(function () {

        Route::get('/login', [LoginController::class, 'index'])
            ->name('login');

        Route::post('/login', [LoginController::class, 'store'])
            ->name('login.store');

        Route::get('/logout', [LoginController::class, 'destroy'])
            ->name('logout');
    });
