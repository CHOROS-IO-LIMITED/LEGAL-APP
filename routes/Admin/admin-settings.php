<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Middleware\AdminMiddleware;

Route::middleware(AdminMiddleware::class)
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/settings', [SettingsController::class, 'index'])
            ->name('settings');

        Route::put('/settings/profile', [SettingsController::class, 'updateProfile'])
            ->name('settings.updateProfile');

        Route::put('/settings/password', [SettingsController::class, 'updatePassword'])
            ->name('settings.updatePassword');
    });
