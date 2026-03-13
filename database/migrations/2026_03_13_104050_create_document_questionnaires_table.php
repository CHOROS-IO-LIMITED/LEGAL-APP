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
        Schema::create('document_questionnaires', function (Blueprint $table) {
            $table->id();

            $table->foreignId('document_draft_item_id')
                ->constrained('document_draft_items')
                ->cascadeOnDelete();

            $table->enum('status', [
                'pending',
                'generated',
                'answered',
            ])->default('pending');

            $table->string('version')->nullable();
            $table->json('schema')->nullable();
            $table->timestamp('generated_at')->nullable();

            $table->timestamps();

            $table->unique('document_draft_item_id');
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_questionnaires');
    }
};
