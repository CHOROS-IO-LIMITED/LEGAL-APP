<?php

// use App\Http\Controllers\Web\KYCController;
// use App\Http\Controllers\Web\Payment\EmailVerificationController;
// use App\Http\Controllers\Web\Payment\PaymentController;
// use App\Http\Controllers\Web\ProductController;
// use App\Http\Controllers\Web\ProductDetailsController;
// use App\Http\Controllers\Web\QnA\QuestionController;
// use Illuminate\Support\Facades\Route;

// // public route
// Route::get('/products', [ProductController::class, 'index'])->name('products');

// // step 2: kyc
// Route::middleware(['auth'])->group(function () {
//     Route::get('/products/details/kyc', [KYCController::class, 'index'])->name('product.kyc');
//     Route::get('/products/details/kyc/start', [KYCController::class, 'startKyc'])->name('kyc.start');
//     Route::get('/products/details/kyc/success', [KYCController::class, 'success'])->name('kyc.success');
//     Route::get('/products/details/kyc/cancel/{document:slug?}', [KYCController::class, 'cancel'])->name('kyc.cancel');
// });

// // step 2:
// Route::get('/products/details/checkout', [PaymentController::class, 'index'])->name('product.checkout');

// // step 3:
// Route::get('/products/details/verify', [EmailVerificationController::class, 'index'])->name('email.verify');

// // step 4:
// Route::get('/products/details/Q&A', [QuestionController::class, 'index'])->name('product.QnA');

// // step 1: product detail with optional index parameter
// Route::get('/products/details', [ProductDetailsController::class, 'list'])->name('product.details.index');
// Route::get('/products/details/{document:slug}', [ProductDetailsController::class, 'index'])->name('product.details');

use App\Http\Controllers\Web\KYCController;
use App\Http\Controllers\Web\Payment\EmailVerificationController;
use App\Http\Controllers\Web\Payment\PaymentController;
use App\Http\Controllers\Web\ProductController;
use App\Http\Controllers\Web\ProductDetailsController;
use App\Http\Controllers\Web\QnA\QuestionController;
use App\Http\Controllers\User\UserDocumentSelectionController;
use Illuminate\Support\Facades\Route;

// public route
Route::get('/products', [ProductController::class, 'index'])->name('products');

Route::middleware(['auth'])->group(function () {
    // create user_documents batch from selected products
    Route::post('/products/details/selection', [UserDocumentSelectionController::class, 'store'])
        ->name('product.selection.store');

    // step 2: kyc
    Route::get('/products/details/kyc', [KYCController::class, 'index'])->name('product.kyc');
    Route::get('/products/details/kyc/start', [KYCController::class, 'startKyc'])->name('kyc.start');
    Route::get('/products/details/kyc/success', [KYCController::class, 'success'])->name('kyc.success');
    Route::get('/products/details/kyc/cancel', [KYCController::class, 'cancel'])->name('kyc.cancel');

    // step 3: checkout
    Route::get('/products/details/checkout', [PaymentController::class, 'index'])->name('product.checkout');
    Route::get('/products/details/checkout/continue', [PaymentController::class, 'continue'])->name('product.checkout.continue');

    // step 4: verification
    Route::get('/products/details/verify', [EmailVerificationController::class, 'index'])->name('email.verify');
    Route::post('/products/details/verify/continue', [EmailVerificationController::class, 'continue'])->name('email.verify.continue');

    // step 5: qna
    // Route::get('/products/details/qna', [QuestionController::class, 'index'])->name('product.qna');

    Route::get('/products/details/qna', [QuestionController::class, 'show'])->name('product.qna.show');
    Route::put('/products/details/qna/{userDocument}', [QuestionController::class, 'update'])->name('product.qna.update');
});

// step 1: product detail
Route::get('/products/details', [ProductDetailsController::class, 'list'])->name('product.details.index');
Route::get('/products/details/{document:slug}', [ProductDetailsController::class, 'index'])->name('product.details');
