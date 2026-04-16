<?php

namespace App\Providers;

use App\Services\AI\Contracts\AnswerNormalizer;
use App\Services\AI\GeminiAnswerNormalizer;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AnswerNormalizer::class, GeminiAnswerNormalizer::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
