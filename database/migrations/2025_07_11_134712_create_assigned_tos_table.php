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
        Schema::create('assigned_tos', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('ticket_id')->constrained('tickets')->onDelete('cascade');
            $table->foreignUuid('assigned_to_id')->constrained('users')->onDelete('cascade');

            $table->foreignUuid('assigned_by_id')->constrained('users')->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assigned_tos');
    }
};
