<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_drafts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('status', [
                'draft',
                'collecting_answers',
                'ready_for_checkout',
                'awaiting_verification',
                'processing',
                'completed',
                'cancelled',
                'expired',
            ])->default('draft');

            $table->unsignedInteger('current_step')->default(1);
            $table->decimal('subtotal', 10, 2)->default(0);

            $table->timestamp('started_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'expires_at']);
            $table->index(['last_activity_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_drafts');
    }
};
