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
        Schema::create('user_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('document_id')
                ->constrained('documents')
                ->cascadeOnDelete();

            $table->uuid('batch_uuid')->index();

            $table->string('status')->default('selected');
            // selected
            // kyc_pending
            // qna_pending
            // qna_completed
            // pdf_generated
            // completed
            // cancelled

            $table->decimal('price', 10, 2);

            $table->json('question_schema_json')->nullable();
            $table->json('answers_json')->nullable();

            $table->string('generated_pdf_path')->nullable();
            $table->string('generated_pdf_original_name')->nullable();
            $table->string('generated_pdf_mime')->nullable();
            $table->unsignedBigInteger('generated_pdf_size')->nullable();

            $table->timestamp('qna_completed_at')->nullable();
            $table->timestamp('pdf_generated_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['document_id']);
            $table->index(['batch_uuid', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_documents');
    }
};
