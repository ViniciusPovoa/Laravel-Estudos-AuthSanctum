<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withProviders()
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', // Descomente se quiser usar routes/api.php
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Adicione esta linha para configurar o Sanctum:
        $middleware->statefulApi();
        
        // Outras configurações de middleware podem ser adicionadas aqui
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();