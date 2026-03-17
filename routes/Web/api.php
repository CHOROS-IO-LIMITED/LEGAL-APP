<?php

use App\Http\Controllers\Web\ComplyCubeWebhookController;
use Illuminate\Support\Facades\Route;


Route::post('/webhook/complycube', [ComplyCubeWebhookController::class, 'handle']);
