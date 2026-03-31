<?php

use App\Http\Controllers\Web\ComplyCubeWebhookController;
use App\Http\Controllers\Web\StripeWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/webhook/complycube', [ComplyCubeWebhookController::class, 'handle']);
Route::post('/webhook/stripe', [StripeWebhookController::class, 'handle']);
