<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Web\HomeController;


// home route
Route::get('/', [HomeController::class, 'index'])->name('home');


// social authentication (google)
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');


// load admin routes
require __DIR__ . '/Admin/admin-auth.php';
require __DIR__ . '/Admin/admin-dashboard.php';
require __DIR__ . '/Admin/admin-settings.php';


// load user routes
require __DIR__ . '/User/user-auth.php';
require __DIR__ . '/User/user-dashboard.php';
require __DIR__ . '/User/user-settings.php';

// load web routes
require __DIR__ . '/Web/products.php';
