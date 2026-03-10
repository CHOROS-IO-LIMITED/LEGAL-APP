<?php

use App\Http\Controllers\Web\LegalController;

use Illuminate\Support\Facades\Route;

// public route
Route::get('/legal-center', [LegalController::class, 'index'])->name('legal');
