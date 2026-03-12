<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    /**
     * Determine whether the user can view any documents.
     */
    public function viewAny(User $user): bool
    {
        return $user->user_role === 'admin';
    }

    /**
     * Determine whether the user can view a specific document.
     */
    public function view(User $user, Document $document): bool
    {
        return $user->user_role === 'admin';
    }

    /**
     * Determine whether the user can create documents.
     */
    public function create(User $user): bool
    {
        return $user->user_role === 'admin';
    }

    /**
     * Determine whether the user can update the document.
     */
    public function update(User $user, Document $document): bool
    {
        return $user->user_role === 'admin';
    }

    /**
     * Determine whether the user can delete the document.
     */
    public function delete(User $user, Document $document): bool
    {
        return $user->user_role === 'admin';
    }
}
