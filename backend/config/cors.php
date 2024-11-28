<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,

    'cors_profile' => \Illuminate\Http\Middleware\HandleCors::class,

    /*
    |--------------------------------------------------------------------------
    | CORS Path Configurations
    |--------------------------------------------------------------------------
    */
    'api' => [
        'paths' => ['api/*'],
        'allow_methods' => ['*'],
        'allow_origins' => ['http://localhost:3000'],
        'allow_headers' => ['*'],
        'expose_headers' => [],
        'max_age' => 60 * 60 * 24,
        'supports_credentials' => true,
    ],
];