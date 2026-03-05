<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserSettingsController;
use App\Http\Middleware\UserMiddleware;

Route::middleware(UserMiddleware::class)
    ->name('user.')
    ->group(function () {

        Route::get('/user/settings', [UserSettingsController::class, 'index'])
            ->name('settings');

        Route::put('/user/settings/profile', [UserSettingsController::class, 'updateProfile'])
            ->name('settings.updateProfile');

        Route::put('/user/settings/password', [UserSettingsController::class, 'updatePassword'])
            ->name('settings.updatePassword');
    });
