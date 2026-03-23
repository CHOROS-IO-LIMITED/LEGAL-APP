<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token (required for POST requests) -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Removed dark mode detection script --}}

    <style>
        html {
            background-color: oklch(1 0 0);
        }

    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- ComplyCube Web SDK -->
    <script src="https://assets.complycube.com/web-sdk/v1/complycube.min.js"></script>

    <script>
    window.RECAPTCHA_SITE_KEY = "{{ env('RECAPTCHA_SITE_KEY') }}";
</script>
<script src="https://www.google.com/recaptcha/api.js?render={{ env('RECAPTCHA_SITE_KEY') }}"></script>

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
