<?php

namespace Database\Seeders;

use App\Actions\Admin\Documents\SyncDocumentSchemasAction;
use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('user_role', 'admin')->first();

        $document = Document::create([
            'user_id' => $admin->id,
            'title' => 'Loan Agreement',
            'slug' => 'loan-agreement',
            'price' => 299.99,
            'description' => 'A comprehensive loan agreement tailored to your specific needs. This document covers all essential terms including loan amount, interest rates, repayment schedules, security provisions, and default clauses. Prepared with full lawyer oversight to ensure legal compliance and protection for both parties.',
            'short_description' => 'Customised loan agreement with full lawyer review, covering terms, interest, repayment, and security.',
            'is_active' => true,
            'is_featured' => true,
            'sort_order' => 1,
        ]);

        app(SyncDocumentSchemasAction::class)->handle($document);
    }
}
