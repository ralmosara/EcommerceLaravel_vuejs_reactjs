<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface ArtistRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find artist by slug
     *
     * @param string $slug
     * @return Model|null
     */
    public function findBySlug(string $slug): ?Model;

    /**
     * Search artists by name
     *
     * @param string $query
     * @param int $limit
     * @return Collection
     */
    public function search(string $query, int $limit = 10): Collection;

    /**
     * Get artists with album count
     *
     * @return Collection
     */
    public function withAlbumCount(): Collection;
}
