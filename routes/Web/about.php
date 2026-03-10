<?php

use App\Http\Controllers\Web\AboutController;

use Illuminate\Support\Facades\Route;

// public route
Route::get('/about', [AboutController::class, 'index'])->name('about');
