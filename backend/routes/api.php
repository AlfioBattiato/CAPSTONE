<?php

use App\Http\Controllers\api\TravelController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use Illuminate\Support\Facades\Http;

// Authentication routes provided by Breeze
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.store');

//travel
Route::name('api.v1.') 
    ->prefix('v1')    
    ->group(function () {
        Route::get('/travels', [TravelController::class, 'index'])->name('travels.index');
        // Route::get('/courses/{id}', [CourseController::class, 'show'])->name('courses.show');

        // Route::get('/users/{id}', [RegisteredUserController::class, 'show'])->name('users.show')->middleware(['auth:sanctum']);
      
  
    });



// Route::get('/travel', [TravelController::class, 'index'])->name('travel.index');

Route::group(['middleware' => ['guest']], function () {
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
    
    });

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)->name('verification.verify');
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])->name('verification.send');
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Routes protected by authentication
Route::middleware('auth:sanctum')->group(function () {

    // Routes for the UserController
    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);

    // ***************************************CHAT***************************************

    // Routes for the ChatController
    Route::get('chats', [ChatController::class, 'index']);
    Route::get('chats/{chat}', [ChatController::class, 'show']);
    Route::post('chats', [ChatController::class, 'store']);
    Route::put('chats/{chat}', [ChatController::class, 'update']);
    Route::delete('chats/{chat}', [ChatController::class, 'destroy']);

    // Routes to add and remove users from chats
    Route::post('chats/{chat}/add-user', [ChatController::class, 'addUserToChat']);
    Route::post('chats/{chat}/remove-user', [ChatController::class, 'removeUserFromChat']);

    // Route to get messages for a specific chat
    Route::get('chats/{chat}/messages', [MessageController::class, 'getMessagesByChat']);

    // Routes for the MessageController
    Route::get('messages', [MessageController::class, 'index']);
    Route::get('messages/{message}', [MessageController::class, 'show']);
    Route::post('messages', [MessageController::class, 'store']);
    Route::post('messages/mark-as-read', [MessageController::class, 'markAsRead']);
    Route::put('messages/{message}', [MessageController::class, 'update']);
    Route::delete('messages/{message}', [MessageController::class, 'destroy']);
});
// funzioni per il map 
Route::get('/proxy/nominatim', function (Request $request) {
    $query = $request->input('q');
    $response = Http::get('https://photon.komoot.io/api/', [
        'q' => $query,
     
    ]);

    return $response->json();
});