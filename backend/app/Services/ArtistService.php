<?php

namespace App\Services;

use App\Repositories\Contracts\ArtistRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class ArtistService
{
    public function __construct(
        protected ArtistRepositoryInterface $artistRepository
    ) {}

    public function getAllArtists(int $perPage = 15): LengthAwarePaginator
    {
        return $this->artistRepository->paginate($perPage);
    }

    public function getArtistBySlug(string $slug): ?Model
    {
        return $this->artistRepository
            ->with(['albums'])
            ->findBySlug($slug);
    }

    public function searchArtists(string $query, int $limit = 10): Collection
    {
        return $this->artistRepository->search($query, $limit);
    }

    public function createArtist(array $data): Model
    {
        return $this->artistRepository->create($data);
    }

    public function updateArtist(int $id, array $data): Model
    {
        return $this->artistRepository->update($id, $data);
    }

    public function deleteArtist(int $id): bool
    {
        return $this->artistRepository->delete($id);
    }

    public function getArtistsWithAlbumCount(): Collection
    {
        return $this->artistRepository->withAlbumCount();
    }
}
