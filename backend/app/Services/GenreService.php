<?php

namespace App\Services;

use App\Repositories\Contracts\GenreRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class GenreService
{
    public function __construct(
        protected GenreRepositoryInterface $genreRepository
    ) {}

    public function getAllGenres(): Collection
    {
        return $this->genreRepository->all();
    }

    public function getGenreTree(): Collection
    {
        return $this->genreRepository->getGenreTree();
    }

    public function getGenreBySlug(string $slug): ?Model
    {
        return $this->genreRepository
            ->with(['children', 'albums'])
            ->findBySlug($slug);
    }

    public function createGenre(array $data): Model
    {
        return $this->genreRepository->create($data);
    }

    public function updateGenre(int $id, array $data): Model
    {
        return $this->genreRepository->update($id, $data);
    }

    public function deleteGenre(int $id): bool
    {
        return $this->genreRepository->delete($id);
    }
}
