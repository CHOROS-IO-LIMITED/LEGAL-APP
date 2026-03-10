<?php

use App\Http\Controllers\Web\BlogsController;

use Illuminate\Support\Facades\Route;

// public route
Route::get('/blogs', [BlogsController::class, 'index'])->name('blogs');
