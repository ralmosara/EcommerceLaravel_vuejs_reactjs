<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AlbumRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find album by slug
     */
    public function findBySlug(string $slug): ?Model;

    /**
     * Get featured albums
     */
    public function getFeatured(int $limit = 10): Collection;

    /**
     * Get albums on sale
     */
    public function getOnSale(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get new releases
     */
    public function getNewReleases(int $limit = 10): Collection;

    /**
     * Search albums
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get albums by artist
     */
    public function getByArtist(int $artistId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get albums by genre
     */
    public function getByGenre(int $genreId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get albums by format
     */
    public function getByFormat(string $format, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get in-stock albums
     */
    public function getInStock(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get albums with advanced filters
     */
    public function getWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator;
}
