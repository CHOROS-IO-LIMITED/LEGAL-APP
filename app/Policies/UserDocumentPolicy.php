<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserDocument;

class UserDocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->user_role, ['user', 'admin'], true);
    }

    public function view(User $user, UserDocument $userDocument): bool
    {
        return $user->id === $userDocument->user_id || $user->user_role === 'admin';
    }

    public function create(User $user): bool
    {
        return in_array($user->user_role, ['user', 'admin'], true);
    }

    public function update(User $user, UserDocument $userDocument): bool
    {
        return $user->id === $userDocument->user_id || $user->user_role === 'admin';
    }

    public function delete(User $user, UserDocument $userDocument): bool
    {
        return $user->id === $userDocument->user_id || $user->user_role === 'admin';
    }

    public function startKyc(User $user, UserDocument $userDocument): bool
    {
        return ($user->id === $userDocument->user_id || $user->user_role === 'admin')
            && in_array($userDocument->status, [
                UserDocument::STATUS_SELECTED,
                UserDocument::STATUS_KYC_PENDING,
            ], true);
    }

    public function answerQuestions(User $user, UserDocument $userDocument): bool
    {
        // dd([
        //     'auth_id' => $user->id,
        //     'doc_user_id' => $userDocument->user_id,
        //     'is_owner' => $user->id === $userDocument->user_id,
        //     'role' => $user->user_role,
        //     'status' => $userDocument->status,
        //     'status_valid' => in_array($userDocument->status, [
        //         UserDocument::STATUS_QNA_PENDING,
        //         UserDocument::STATUS_QNA_COMPLETED,
        //     ], true),
        // ]);
        return ($user->id === $userDocument->user_id || $user->user_role === 'admin')
            && in_array($userDocument->status, [
                UserDocument::STATUS_QNA_PENDING,
                UserDocument::STATUS_QNA_COMPLETED,
                UserDocument::STATUS_VERIFICATION_PENDING,
            ], true);
    }

    public function generatePdf(User $user, UserDocument $userDocument): bool
    {
        return ($user->id === $userDocument->user_id || $user->user_role === 'admin')
            && $userDocument->status === UserDocument::STATUS_QNA_COMPLETED;
    }
}
