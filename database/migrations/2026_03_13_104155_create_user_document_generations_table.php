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
        Schema::create('user_document_generations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_document_id')
                ->constrained('user_documents')
                ->cascadeOnDelete();

            $table->foreignId('document_questionnaire_id')
                ->nullable()
                ->constrained('document_questionnaires')
                ->nullOnDelete();

            $table->string('provider')->nullable();
            $table->string('model')->nullable();

            $table->longText('prompt')->nullable();
            $table->longText('response')->nullable();

            $table->json('input_payload')->nullable();
            $table->json('output_payload')->nullable();

            $table->enum('status', [
                'queued',
                'success',
                'failed',
            ])->default('queued');

            $table->text('error_message')->nullable();
            $table->timestamp('generated_at')->nullable();

            $table->timestamps();

            $table->index(['user_document_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_document_generations');
    }
};
