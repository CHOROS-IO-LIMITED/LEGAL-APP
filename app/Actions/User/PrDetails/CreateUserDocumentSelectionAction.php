<?php

namespace App\Actions\User\PrDetails;

use App\Models\Document;
use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateUserDocumentSelectionAction
{
    public function handle(User $user, array $documentIds): string
    {
        $documents = Document::query()
            ->active()
            ->whereIn('id', $documentIds)
            ->get();

        if ($documents->count() !== count(array_unique($documentIds))) {
            abort(422, 'One or more selected documents are invalid or inactive.');
        }

        $batchUuid = (string) Str::uuid();

        DB::transaction(function () use ($user, $documents, $batchUuid) {
            foreach ($documents as $document) {
                UserDocument::create([
                    'user_id' => $user->id,
                    'document_id' => $document->id,
                    'batch_uuid' => $batchUuid,
                    'status' => UserDocument::STATUS_KYC_PENDING,
                    'price' => $document->price,
                ]);
            }
        });

        return $batchUuid;
    }
}
