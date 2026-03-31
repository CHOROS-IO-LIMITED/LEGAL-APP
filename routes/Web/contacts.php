<?php

use App\Http\Controllers\Web\ContactController;

use Illuminate\Support\Facades\Route;

// public route
Route::get('/contacts', [ContactController::class, 'index'])->name('contacts');

// Handle form submission
Route::post('/contact/submit', [ContactController::class, 'submit']);
