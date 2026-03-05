<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Middleware\GuestMiddleware;

Route::middleware(GuestMiddleware::class)->group(function () {

    Route::get('/login', [LoginController::class, 'index'])
        ->name('auth.login');

    Route::get('/register', [RegisterController::class, 'index'])
        ->name('auth.register');
});

Route::post('/login', [LoginController::class, 'store'])
    ->name('auth.login.store');

Route::post('/register', [RegisterController::class, 'store'])
    ->name('auth.register.store');

Route::get('/logout', [LoginController::class, 'destroy'])
    ->name('auth.logout');
