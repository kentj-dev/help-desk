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
        Schema::create('mode_of_addressings', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->integer('sort_order');

            $table->string('mode');

            $table->foreignUuid('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mode_of_addressings');
    }
};
