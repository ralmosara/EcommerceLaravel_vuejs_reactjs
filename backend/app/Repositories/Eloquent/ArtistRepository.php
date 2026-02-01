<?php

namespace App\Repositories\Eloquent;

use App\Models\Artist;
use App\Repositories\Contracts\ArtistRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ArtistRepository extends BaseRepository implements ArtistRepositoryInterface
{
    public function __construct(Artist $model)
    {
        parent::__construct($model);
    }

    public function findBySlug(string $slug): ?Model
    {
        return $this->findBy('slug', $slug);
    }

    public function search(string $query, int $limit = 10): Collection
    {
        return $this->model
            ->whereFullText(['name', 'bio'], $query)
            ->orWhere('name', 'LIKE', "%{$query}%")
            ->limit($limit)
            ->get();
    }

    public function withAlbumCount(): Collection
    {
        return $this->model
            ->withCount('albums')
            ->orderBy('name')
            ->get();
    }
}
