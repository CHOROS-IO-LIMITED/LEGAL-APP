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
        Schema::create('document_questionnaire_answers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('document_questionnaire_id')
                ->constrained('document_questionnaires')
                ->cascadeOnDelete();

            $table->string('question_key');
            $table->string('question_label')->nullable();
            $table->longText('answer')->nullable();
            $table->json('meta')->nullable();

            $table->timestamps();

            $table->unique(['document_questionnaire_id', 'question_key']);
            $table->index(['document_questionnaire_id', 'question_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_questionnaire_answers');
    }
};
