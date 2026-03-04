<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\User\UserDashboardController;
use App\Http\Controllers\User\UserSettingsController;
use App\Http\Middleware\GuestMiddleware;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\UserMiddleware;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Guest routes (authentication)
Route::middleware(GuestMiddleware::class)->group(function () {
  Route::get('login', [LoginController::class, 'index'])->name('auth.login');
  Route::get('register', [RegisterController::class, 'index'])->name('auth.register');
});

Route::post('login', [LoginController::class, 'store'])->name('auth.login.store');
Route::post('register', [RegisterController::class, 'store'])->name('auth.register.store');
Route::get('logout', [LoginController::class, 'destroy'])->name('auth.logout');

// Social authentication
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');

// Admin routes
Route::middleware(AdminMiddleware::class)->group(function () {
  Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
  Route::get('admin/settings', [SettingsController::class, 'index'])->name('admin.settings');
  Route::put('admin/settings/profile', [SettingsController::class, 'updateProfile'])->name('admin.settings.updateProfile');
  Route::put('admin/settings/password', [SettingsController::class, 'updatePassword'])->name('admin.settings.updatePassword');
});

// User routes
Route::middleware(UserMiddleware::class)->group(function () {
  Route::get('dashboard', [UserDashboardController::class, 'index'])->name('user.dashboard');
  Route::get('user/settings', [UserSettingsController::class, 'index'])->name('user.settings');
  Route::put('user/settings/profile', [UserSettingsController::class, 'updateProfile'])->name('user.settings.updateProfile');
  Route::put('user/settings/password', [UserSettingsController::class, 'updatePassword'])->name('user.settings.updatePassword');
});
