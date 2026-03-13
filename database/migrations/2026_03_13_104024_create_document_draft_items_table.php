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
        Schema::create('document_draft_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('document_draft_id')
                ->constrained('document_drafts')
                ->cascadeOnDelete();

            $table->foreignId('document_id')
                ->constrained('documents')
                ->cascadeOnDelete();

            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);

            $table->enum('status', [
                'pending',
                'questionnaire_pending',
                'questionnaire_ready',
                'answered',
                'generated',
                'failed',
            ])->default('pending');

            $table->timestamps();

            $table->unique(['document_draft_id', 'document_id']);
            $table->index(['document_draft_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_draft_items');
    }
};
