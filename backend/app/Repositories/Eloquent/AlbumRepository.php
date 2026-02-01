<?php

namespace App\Repositories\Eloquent;

use App\Models\Album;
use App\Repositories\Contracts\AlbumRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class AlbumRepository extends BaseRepository implements AlbumRepositoryInterface
{
    public function __construct(Album $model)
    {
        parent::__construct($model);
    }

    public function findBySlug(string $slug): ?Model
    {
        return $this->findBy('slug', $slug);
    }

    public function getFeatured(int $limit = 10): Collection
    {
        return $this->model
            ->featured()
            ->with(['artist', 'genres', 'inventory'])
            ->limit($limit)
            ->get();
    }

    public function getOnSale(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->onSale()
            ->with(['artist', 'genres', 'inventory'])
            ->paginate($perPage);
    }

    public function getNewReleases(int $limit = 10): Collection
    {
        return $this->model
            ->with(['artist', 'genres', 'inventory'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->whereFullText(['title', 'description'], $query)
            ->orWhere('title', 'LIKE', "%{$query}%")
            ->orWhereHas('artist', function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%");
            })
            ->with(['artist', 'genres', 'inventory'])
            ->paginate($perPage);
    }

    public function getByArtist(int $artistId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->where('artist_id', $artistId)
            ->with(['artist', 'genres', 'inventory'])
            ->paginate($perPage);
    }

    public function getByGenre(int $genreId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->whereHas('genres', function ($q) use ($genreId) {
                $q->where('genres.id', $genreId);
            })
            ->with(['artist', 'genres', 'inventory'])
            ->paginate($perPage);
    }

    public function getByFormat(string $format, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->byFormat($format)
            ->with(['artist', 'genres', 'inventory'])
            ->paginate($perPage);
    }

    public function getInStock(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->inStock()
            ->with(['artist', 'genres', 'inventory'])
            ->paginate($perPage);
    }

    public function getWithFilters(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query();

        // Filter by format
        if (isset($filters['format'])) {
            $query->where('format', $filters['format']);
        }

        // Filter by price range
        if (isset($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }
        if (isset($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        // Filter by featured status
        if (isset($filters['is_featured'])) {
            $query->where('is_featured', $filters['is_featured']);
        }

        // Filter by stock status
        if (isset($filters['stock_status'])) {
            $status = $filters['stock_status'];

            if ($status === 'in_stock') {
                $query->whereHas('inventory', function ($q) {
                    $q->where('quantity', '>', 0);
                });
            } elseif ($status === 'out_of_stock') {
                $query->whereHas('inventory', function ($q) {
                    $q->where('quantity', '=', 0);
                });
            } elseif ($status === 'low_stock') {
                $query->whereHas('inventory', function ($q) {
                    $q->where('quantity', '>', 0)->where('quantity', '<=', 10);
                });
            }
        }

        // Filter by artist
        if (isset($filters['artist_id'])) {
            $query->where('artist_id', $filters['artist_id']);
        }

        // Filter by genre
        if (isset($filters['genre_id'])) {
            $query->whereHas('genres', function ($q) use ($filters) {
                $q->where('genres.id', $filters['genre_id']);
            });
        }

        // Filter by on sale status
        if (isset($filters['on_sale'])) {
            if ($filters['on_sale']) {
                $query->whereNotNull('sale_price')->whereColumn('sale_price', '<', 'price');
            } else {
                $query->where(function ($q) {
                    $q->whereNull('sale_price')
                      ->orWhereColumn('sale_price', '>=', 'price');
                });
            }
        }

        // Search filter
        if (isset($filters['search']) && !empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->whereFullText(['title', 'description'], $search)
                  ->orWhere('title', 'LIKE', "%{$search}%")
                  ->orWhereHas('artist', function ($q2) use ($search) {
                      $q2->where('name', 'LIKE', "%{$search}%");
                  });
            });
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Eager load relationships
        $query->with(['artist', 'genres', 'inventory']);

        return $query->paginate($perPage);
    }
}
