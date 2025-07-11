<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mode_of_addressing_tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('mode_of_addressing_id')->constrained('mode_of_addressings')->onDelete('cascade');
            $table->foreignUuid('ticket_id')->constrained('tickets')->onDelete('cascade');
            $table->foreignUuid('added_by')->constrained('users')->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mode_of_addressing_tickets');
    }
};
