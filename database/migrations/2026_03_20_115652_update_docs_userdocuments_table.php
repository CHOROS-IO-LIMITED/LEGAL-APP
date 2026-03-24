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
        Schema::table('user_documents', function (Blueprint $table) {
            $table->string('generated_docx_path')->nullable()->after('generated_pdf_path');
            $table->string('generated_docx_original_name')->nullable()->after('generated_docx_path');
            $table->string('generated_docx_mime')->nullable()->after('generated_docx_original_name');
            $table->unsignedBigInteger('generated_docx_size')->nullable()->after('generated_docx_mime');
            $table->timestamp('docx_generated_at')->nullable()->after('generated_docx_size');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
