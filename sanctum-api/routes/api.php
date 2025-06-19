<?php

use App\Http\Controllers\CategoriesController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\TodoController;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Log;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

   Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->middleware(['signed'])
            ->name('verification.verify');


    Route::middleware('auth:sanctum')->group(function () {


         

    Route::post('/email/verification-notification', [EmailVerificationRequest::class, 'sendVerificationEmail']);

    Route::post('/logout', [AuthController::class, 'logout']);


    Route::post('/categories',[CategoriesController::class, 'store']);
    Route::put('/categories/{id}', [CategoriesController::class, 'update']);
    Route::get('/categories',[CategoriesController::class, 'index']);
    Route::get('/categories/{id}',[CategoriesController::class, 'show']);
    Route::delete('/categories/{id}', [CategoriesController::class, 'destroy']);

    Route::post('/todos/{id}/upload-document', [TodoController::class, 'uploadDocument']);
    Route::patch('/todos/{id}/toggle', [TodoController::class, 'markasCompleted']);
    Route::get('/todos', [TodoController::class, 'index']);
    Route::post('/todos', [TodoController::class, 'store']);
    Route::get('/todos/{id}', [TodoController::class, 'show']);
    Route::put('/todos/{id}', [TodoController::class, 'update']);
    Route::delete('/todos/{id}', [TodoController::class, 'destroy']);
});
