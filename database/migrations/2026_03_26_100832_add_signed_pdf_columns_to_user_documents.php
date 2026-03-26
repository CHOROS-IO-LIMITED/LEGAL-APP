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
            $table->string('signed_pdf_path')->nullable()->after('generated_pdf_size');
            $table->string('signed_pdf_original_name')->nullable()->after('signed_pdf_path');
            $table->string('signed_pdf_mime')->nullable()->after('signed_pdf_original_name');
            $table->unsignedBigInteger('signed_pdf_size')->nullable()->after('signed_pdf_mime');
            $table->string('signature_status')->nullable()->after('signature_envelope_id');
            $table->timestamp('signature_completed_at')->nullable()->after('completed_at');
            $table->index(['signature_envelope_id'], 'user_documents_signature_envelope_idx');
            $table->index(['status', 'signature_status'], 'user_documents_status_signature_status_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_documents', function (Blueprint $table) {
            $table->dropIndex('user_documents_signature_envelope_idx');
            $table->dropIndex('user_documents_status_signature_status_idx');

            $table->dropColumn([
                'signed_pdf_path',
                'signed_pdf_original_name',
                'signed_pdf_mime',
                'signed_pdf_size',
                'signature_status',
                'signature_completed_at',
            ]);
        });
    }
};
