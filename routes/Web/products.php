<?php

use App\Http\Controllers\Web\KYCController;
use App\Http\Controllers\Web\Payment\EmailVerificationController;
use App\Http\Controllers\Web\Payment\PaymentController;
use App\Http\Controllers\Web\ProductController;
use App\Http\Controllers\Web\ProductDetailsController;
use App\Http\Controllers\Web\QnA\QuestionController;
use Illuminate\Support\Facades\Route;

// public route
Route::get('/products', [ProductController::class, 'index'])->name('products');

// step 2: kyc
Route::get('/products/details/kyc', [KYCController::class, 'index'])->name('product.kyc');

// step 2:
Route::get('/products/details/checkout', [PaymentController::class, 'index'])->name('product.checkout');

// step 3:
Route::get('/products/details/verify', [EmailVerificationController::class, 'index'])->name('email.verify');

// step 4:
Route::get('/products/details/Q&A', [QuestionController::class, 'index'])->name('product.QnA');

// step 1: product detail with optional index parameter
Route::get('/products/details', [ProductDetailsController::class, 'list'])->name('product.details.index');
Route::get('/products/details/{document:slug}', [ProductDetailsController::class, 'index'])->name('product.details');
