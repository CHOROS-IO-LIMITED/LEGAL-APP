<?php

use App\Http\Controllers\User\UserDashboardController;
use App\Http\Controllers\User\UserDocumentDashboardActionController;
use App\Http\Controllers\User\UserDocumentSigningController;
use App\Http\Middleware\UserMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(UserMiddleware::class)->group(function () {

    Route::prefix('dashboard')->name('user.')->group(function () {
        Route::get('/', [UserDashboardController::class, 'index'])->name('dashboard');
        Route::post('/documents/{userDocument}/submit-for-approval', [UserDocumentDashboardActionController::class, 'submitForApproval'])->name('documents.submit-for-approval');
        Route::post('/documents/{userDocument}/return-to-questions', [UserDocumentDashboardActionController::class, 'returnToQuestions'])->name('documents.return-to-questions');
        Route::get('/documents/{userDocument}/download', [UserDocumentDashboardActionController::class, 'download'])->name('documents.download');
        Route::post('/user/documents/{userDocument}/sign', [UserDocumentSigningController::class, 'start'])->name('documents.sign');
        Route::get('/user/documents/{userDocument}/sign/return', [UserDocumentSigningController::class, 'handleReturn'])->name('documents.sign.return');
    });
});
