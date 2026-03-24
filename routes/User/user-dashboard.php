<?php

use App\Http\Controllers\Admin\AdminUserDocumentWorkflowController;
use App\Http\Controllers\User\UserDashboardController;
use App\Http\Controllers\User\UserDocumentDashboardActionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('dashboard')->name('user.')->group(function () {
        Route::get('/', [UserDashboardController::class, 'index'])->name('dashboard');

        Route::post('/documents/{userDocument}/submit-for-approval', [UserDocumentDashboardActionController::class, 'submitForApproval'])->name('documents.submit-for-approval');

        Route::post('/documents/{userDocument}/return-to-questions', [UserDocumentDashboardActionController::class, 'returnToQuestions'])->name('documents.return-to-questions');

        Route::get('/documents/{userDocument}/download', [UserDocumentDashboardActionController::class, 'download'])->name('documents.download');
    });

    // Route::prefix('admin/user-documents')->name('admin.user-documents.')->group(function () {
    //     Route::post('/{userDocument}/approve-for-signature', [AdminUserDocumentWorkflowController::class, 'approveForSignature'])
    //         ->name('approve-for-signature');

    //     Route::post('/{userDocument}/reject', [AdminUserDocumentWorkflowController::class, 'reject'])
    //         ->name('reject');

    //     Route::post('/{userDocument}/mark-completed', [AdminUserDocumentWorkflowController::class, 'markCompleted'])
    //         ->name('mark-completed');
    // });
});
