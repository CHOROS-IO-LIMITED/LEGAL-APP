<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
    ],

    'gemini' => [
        'key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL'),
        'fallback_model' => env('GEMINI_FALLBACK_MODEL', 'gemini-3-flash-preview'),
        'pdf_model' => env('GEMINI_PDF_MODEL', 'gemini-3-flash-preview'),
        'timeout' => env('GEMINI_TIMEOUT'),
        'enabled' => filter_var(env('GEMINI_ENABLED', true), FILTER_VALIDATE_BOOL),
    ],

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'docusign' => [
        'integrator_key' => env('DOCUSIGN_INTEGRATOR_KEY'),
        'user_id' => env('DOCUSIGN_USER_ID'),
        'account_id' => env('DOCUSIGN_ACCOUNT_ID'),
        'base_uri' => rtrim((string) env('DOCUSIGN_BASE_URI', 'https://demo.docusign.net'), '/'),
        'oauth_base_uri' => rtrim((string) env('DOCUSIGN_OAUTH_BASE_URI', 'https://account-d.docusign.com'), '/'),
        'redirect_uri' => env('DOCUSIGN_REDIRECT_URI'),
        'access_token' => env('DOCUSIGN_ACCESS_TOKEN'),
        'connect_secret' => env('DOCUSIGN_CONNECT_SECRET'),
        'connect_enabled' => filter_var(env('DOCUSIGN_CONNECT_ENABLED', false), FILTER_VALIDATE_BOOL),
    ],

];
