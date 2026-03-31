<?php

use App\Http\Controllers\Web\BlogsController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// public route
Route::get('/blogs', [BlogsController::class, 'index'])->name('blogs');
// Route::get('/blogs/the-future-of-legal-services', function () {
//     return Inertia::render('Web/Blogs/BlogPages/TheFutureOfLegalServices');
// });
// Route::get('/blogs/how-ai-is-transforming-legal-document-creation', function () {
//     return Inertia::render('Web/Blogs/BlogPages/HowAIisTransformingLegalDocumentCreation');
// });
// Route::get('/blogs/why-small-businesses-need-smarter-legal-tools', function () {
//     return Inertia::render('Web/Blogs/BlogPages/WhySmallBusinessesNeedSmarterLegalTools');
// });
// Route::get('/blogs/from-idea-to-signed-document-in-minutes', function () {
//     return Inertia::render('Web/Blogs/BlogPages/From-Idea-to-Signed-Document-in-Minutes');
// });
Route::get('/blogs/{slug}', [BlogsController::class, 'show'])->name('blogs.show');
