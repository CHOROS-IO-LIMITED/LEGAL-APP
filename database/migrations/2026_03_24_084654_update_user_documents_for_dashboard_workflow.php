<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_documents', function (Blueprint $table) {
            if (! Schema::hasColumn('user_documents', 'recipients_json')) {
                $table->json('recipients_json')->nullable()->after('answers_json');
            }

            if (! Schema::hasColumn('user_documents', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('qna_completed_at');
            }

            if (! Schema::hasColumn('user_documents', 'rejected_at')) {
                $table->timestamp('rejected_at')->nullable()->after('approved_at');
            }

            if (! Schema::hasColumn('user_documents', 'rejected_reason')) {
                $table->text('rejected_reason')->nullable()->after('rejected_at');
            }
        });

        DB::table('user_documents')
            ->whereIn('status', ['selected', 'kyc_pending', 'kyc_completed', 'checkout_pending', 'checkout_completed', 'verification_pending', 'verification_completed', 'qna_pending', 'qna_completed', 'pdf_generated'])
            ->update(['status' => 'draft']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_documents', function (Blueprint $table) {
            if (Schema::hasColumn('user_documents', 'recipients_json')) {
                $table->dropColumn('recipients_json');
            }

            if (Schema::hasColumn('user_documents', 'approved_at')) {
                $table->dropColumn('approved_at');
            }

            if (Schema::hasColumn('user_documents', 'rejected_at')) {
                $table->dropColumn('rejected_at');
            }

            if (Schema::hasColumn('user_documents', 'rejected_reason')) {
                $table->dropColumn('rejected_reason');
            }
        });
    }
};
