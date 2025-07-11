<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureUserIsActivated;
use Inertia\Inertia;
use App\Http\Controllers\TicketsController;

Route::middleware(['client.flag'])->group(function () {
    Route::get('/welcome', function () {
        return Inertia::render('welcome');
    })->name('home');


});

require __DIR__ . '/client-settings.php';
