<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Rotte per l'autenticazione fornite da Breeze
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

// Rotte protette da autenticazione
Route::middleware('auth:sanctum')->group(function () {

    // Rotte per il UserController
    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);

    // ***************************************CHAT***************************************

    // Rotte per il ChatController
    Route::get('chats', [ChatController::class, 'index']);
    Route::get('chats/{chat}', [ChatController::class, 'show']);
    Route::post('chats', [ChatController::class, 'store']);
    Route::put('chats/{chat}', [ChatController::class, 'update']);
    Route::delete('chats/{chat}', [ChatController::class, 'destroy']);

    // Rotte per aggiungere e rimuovere utenti dalle chat
    Route::post('chats/{chat}/add-user', [ChatController::class, 'addUserToChat']);
    Route::post('chats/{chat}/remove-user', [ChatController::class, 'removeUserFromChat']);

    // Rotte per il MessageController
    Route::get('messages', [MessageController::class, 'index']);
    Route::get('messages/{message}', [MessageController::class, 'show']);
    Route::post('messages', [MessageController::class, 'store']);
    Route::put('messages/{message}', [MessageController::class, 'update']);
    Route::delete('messages/{message}', [MessageController::class, 'destroy']);
});

// Rotta per ottenere l'utente autenticato
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
