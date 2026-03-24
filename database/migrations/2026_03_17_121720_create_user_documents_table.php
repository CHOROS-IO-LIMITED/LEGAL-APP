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

            // notes
            $table->text('client_note')->nullable();
            $table->text('lawyer_note')->nullable();

            // signature / docsign
            $table->json('signature_recipients_json')->nullable();
            $table->string('docusign_client_name')->nullable();
            $table->string('docusign_client_email')->nullable();
            $table->string('signature_provider')->nullable();
            $table->string('signature_envelope_id')->nullable();

            // generated pdf
            $table->string('generated_pdf_path')->nullable();
            $table->string('generated_pdf_original_name')->nullable();
            $table->string('generated_pdf_mime')->nullable();
            $table->unsignedBigInteger('generated_pdf_size')->nullable();

            // timestamps
            $table->timestamp('qna_completed_at')->nullable();
            $table->timestamp('pdf_generated_at')->nullable();
            $table->timestamp('submitted_for_approval_at')->nullable();
            $table->timestamp('approved_for_signature_at')->nullable();
            $table->timestamp('sent_for_signature_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            // indexes
            $table->index(['user_id', 'status']);
            $table->index(['document_id']);
            $table->index(['batch_uuid', 'user_id']);
            $table->index(['user_id', 'submitted_for_approval_at'], 'user_documents_user_submitted_idx');
            $table->index(['status', 'submitted_for_approval_at'], 'user_documents_status_submitted_idx');
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
