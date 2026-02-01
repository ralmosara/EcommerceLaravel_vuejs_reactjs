<?php

namespace App\Repositories\Eloquent;

use App\Models\Genre;
use App\Repositories\Contracts\GenreRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class GenreRepository extends BaseRepository implements GenreRepositoryInterface
{
    public function __construct(Genre $model)
    {
        parent::__construct($model);
    }

    public function findBySlug(string $slug): ?Model
    {
        return $this->findBy('slug', $slug);
    }

    public function getRootGenres(): Collection
    {
        return $this->model
            ->rootOnly()
            ->ordered()
            ->get();
    }

    public function getGenreTree(): Collection
    {
        return $this->model
            ->rootOnly()
            ->with('children')
            ->ordered()
            ->get();
    }

    public function withChildren(): Collection
    {
        return $this->model
            ->with('children')
            ->ordered()
            ->get();
    }
}
