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

            $table->foreignId('document_draft_id')
                ->nullable()
                ->constrained('document_drafts')
                ->nullOnDelete();

            $table->foreignId('document_draft_item_id')
                ->nullable()
                ->constrained('document_draft_items')
                ->nullOnDelete();

            $table->string('title');
            $table->string('reference_number')->unique()->nullable();

            $table->enum('status', [
                'draft',
                'generating',
                'generated',
                'pending_review',
                'approved',
                'changes_requested',
                'rejected',
                'ready_to_sign',
                'completed',
            ])->default('draft');

            $table->longText('generated_content')->nullable();

            $table->string('file_path')->nullable();
            $table->string('file_original_name')->nullable();
            $table->string('file_mime')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();

            $table->timestamp('generated_at')->nullable();
            $table->timestamp('submitted_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['document_id']);
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
