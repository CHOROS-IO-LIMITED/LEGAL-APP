<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        @page {
            margin: 28mm 20mm 24mm 20mm;
        }

        body {
            font-family: DejaVu Serif, serif;
            font-size: 12px;
            line-height: 1.55;
            color: #111827;
        }

        .header {
            margin-bottom: 18px;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 10px;
        }

        .title {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 0.3px;
            margin-bottom: 4px;
        }

        .meta {
            font-size: 11px;
            color: #4b5563;
        }

        .body {
            white-space: pre-wrap;
        }

        .footer-note {
            margin-top: 24px;
            font-size: 10px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="title">{{ $title }}</div>
        <div class="meta">
            Date: {{ $documentDate }}
        </div>
    </div>

    <div class="body">{{ $body }}</div>

    <div class="footer-note">
        Generated for User Document #{{ $userDocument->id }}
    </div>
</body>

</html>
