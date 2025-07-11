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
        Schema::create('tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('ticket_number');
            $table->enum('status', ['open', 'on-going', 'resolved', 'rejected'])->default('open');

            $table->enum('client_type', ['student', 'parent', 'hei_personnel', 'other_stakeholders'])->nullable();

            $table->string('title');
            $table->text('details');
            $table->foreignUuid('ticket_owner_id')->constrained('users')->onDelete('cascade');

            $table->foreignUuid('ticket_in_charge_id')->nullable()->constrained('users')->onDelete('cascade');

            $table->timestamp('date_received_by_in_charge', precision: 0)->nullable();
            $table->timestamps();

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
