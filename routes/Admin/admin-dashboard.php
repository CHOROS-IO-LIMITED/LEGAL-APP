<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DocuSignController;
use App\Http\Controllers\Admin\AdminUserDocumentReviewController;
use App\Http\Controllers\Admin\DownloadUserDocumentController;
use App\Http\Middleware\AdminMiddleware;

Route::middleware(AdminMiddleware::class)
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::post('/documents/{userDocument}/approve', [AdminUserDocumentReviewController::class, 'approve'])->name('documents.approve');
        Route::post('/documents/{userDocument}/reject', [AdminUserDocumentReviewController::class, 'reject'])->name('documents.reject');
        Route::post('/documents/{userDocument}/complete', [AdminUserDocumentReviewController::class, 'markCompleted'])->name('documents.complete');
        Route::get('/documents/{userDocument}/download', DownloadUserDocumentController::class)->name('documents.download');
        Route::get('/documents/docusign/return/{userDocument}', [DocuSignController::class, 'handleReturn'])->name('documents.docusign.return');
    });

Route::post('/webhooks/docusign/connect', [DocuSignController::class, 'connectWebhook'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])->name('webhooks.docusign.connect');
