<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface GenreRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find genre by slug
     */
    public function findBySlug(string $slug): ?Model;

    /**
     * Get all root genres (no parent)
     */
    public function getRootGenres(): Collection;

    /**
     * Get genre tree (hierarchical structure)
     */
    public function getGenreTree(): Collection;

    /**
     * Get genres with children
     */
    public function withChildren(): Collection;
}
