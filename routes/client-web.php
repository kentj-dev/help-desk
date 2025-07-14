<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureUserIsActivated;
use Inertia\Inertia;
use App\Http\Controllers\TicketsController;

Route::middleware(['client.flag'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('welcome');
    })->name('home');
});

Route::middleware(['auth', 'verified', EnsureUserIsActivated::class, 'client.flag'])->group(function () {
    Route::get('/tickets', [TicketsController::class, 'index'])
        ->name('tickets');

    Route::get('create-ticket', [TicketsController::class, 'createTicket'])
        ->name('create.ticket');

    Route::post('create-ticket', [TicketsController::class, 'submitCreateTicket'])
        ->name('submit.create.ticket');

    Route::post('tickets/add/reply', [TicketsController::class, 'addReply'])
        ->name('add.reply');
    Route::post('tickets/add/child-reply/{ticketId}/{replyId}', [TicketsController::class, 'addChildReply'])
        ->name('add.child-reply');
});

require __DIR__ . '/client-settings.php';
