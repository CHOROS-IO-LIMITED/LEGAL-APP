<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\BillingController;
use App\Http\Middleware\AdminMiddleware;

Route::middleware(AdminMiddleware::class)
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/billings', [BillingController::class, 'index'])
            ->name('billings');
    });
