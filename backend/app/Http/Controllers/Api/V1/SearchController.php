<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlbumResource;
use App\Http\Resources\ArtistResource;
use App\Models\Album;
use App\Models\Artist;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    use ApiResponses;

    /**
     * Global search across all searchable resources
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => ['required', 'string', 'min:2'],
            'type' => ['nullable', 'in:artists,albums,all'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = $request->input('q');
        $type = $request->input('type', 'all');
        $perPage = min($request->input('per_page', 15), 100);

        $results = [];

        if ($type === 'artists' || $type === 'all') {
            $artists = Artist::where('name', 'LIKE', "%{$query}%")
                ->orWhere('origin', 'LIKE', "%{$query}%")
                ->limit($perPage)
                ->get();
            $results['artists'] = ArtistResource::collection($artists);
        }

        if ($type === 'albums' || $type === 'all') {
            $albums = Album::where('title', 'LIKE', "%{$query}%")
                ->orWhere('description', 'LIKE', "%{$query}%")
                ->orWhereHas('artist', function ($q) use ($query) {
                    $q->where('name', 'LIKE', "%{$query}%");
                })
                ->with(['artist', 'genres', 'inventory'])
                ->limit($perPage)
                ->get();
            $results['albums'] = AlbumResource::collection($albums);
        }

        return $this->successResponse($results);
    }

    /**
     * Search artists only
     */
    public function searchArtists(Request $request): JsonResponse
    {
        $request->validate([
            'q' => ['required', 'string', 'min:2'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = $request->input('q');
        $perPage = min($request->input('per_page', 15), 100);

        $artists = Artist::where('name', 'LIKE', "%{$query}%")
            ->orWhere('origin', 'LIKE', "%{$query}%")
            ->paginate($perPage);

        return $this->successResponse([
            'data' => ArtistResource::collection($artists->items()),
            'current_page' => $artists->currentPage(),
            'from' => $artists->firstItem(),
            'to' => $artists->lastItem(),
            'per_page' => $artists->perPage(),
            'total' => $artists->total(),
            'last_page' => $artists->lastPage(),
        ]);
    }

    /**
     * Search albums only with advanced filters
     */
    public function searchAlbums(Request $request): JsonResponse
    {
        $request->validate([
            'q' => ['required', 'string', 'min:2'],
            'format' => ['nullable', 'in:vinyl,cd,cassette,digital'],
            'genre' => ['nullable', 'string'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'min_rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'on_sale' => ['nullable', 'boolean'],
            'in_stock' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = $request->input('q');
        $perPage = min($request->input('per_page', 15), 100);

        // Start with search query using LIKE
        $builder = Album::where(function ($q) use ($query) {
            $q->where('title', 'LIKE', "%{$query}%")
                ->orWhere('description', 'LIKE', "%{$query}%")
                ->orWhereHas('artist', function ($artistQuery) use ($query) {
                    $artistQuery->where('name', 'LIKE', "%{$query}%");
                });
        });

        // Apply filters
        if ($request->filled('format')) {
            $builder->where('format', $request->input('format'));
        }

        if ($request->filled('min_price')) {
            $builder->where('price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $builder->where('price', '<=', $request->input('max_price'));
        }

        if ($request->filled('min_rating')) {
            $builder->where('avg_rating', '>=', $request->input('min_rating'));
        }

        if ($request->boolean('on_sale')) {
            $builder->whereNotNull('sale_price');
        }

        if ($request->filled('genre')) {
            $builder->whereHas('genres', function ($q) use ($request) {
                $q->where('slug', $request->input('genre'));
            });
        }

        if ($request->boolean('in_stock')) {
            $builder->whereHas('inventory', function ($q) {
                $q->where('quantity', '>', 0);
            });
        }

        $albums = $builder
            ->with(['artist', 'genres', 'inventory'])
            ->paginate($perPage);

        return $this->successResponse([
            'data' => AlbumResource::collection($albums->items()),
            'current_page' => $albums->currentPage(),
            'from' => $albums->firstItem(),
            'to' => $albums->lastItem(),
            'per_page' => $albums->perPage(),
            'total' => $albums->total(),
            'last_page' => $albums->lastPage(),
        ]);
    }

    /**
     * Get search suggestions/autocomplete
     */
    public function suggestions(Request $request): JsonResponse
    {
        $request->validate([
            'q' => ['required', 'string', 'min:1'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:20'],
        ]);

        $query = $request->input('q');
        $limit = min($request->input('limit', 10), 20);

        $artistSuggestions = Artist::where('name', 'LIKE', "%{$query}%")
            ->limit($limit)
            ->get()
            ->map(fn($artist) => [
                'type' => 'artist',
                'slug' => $artist->slug,
                'name' => $artist->name,
                'subtitle' => $artist->origin,
            ]);

        $albumSuggestions = Album::where('title', 'LIKE', "%{$query}%")
            ->with('artist')
            ->limit($limit)
            ->get()
            ->map(fn($album) => [
                'type' => 'album',
                'slug' => $album->slug,
                'name' => $album->title,
                'subtitle' => $album->artist?->name,
                'image' => $album->cover_image,
            ]);

        return $this->successResponse([
            'suggestions' => $artistSuggestions->concat($albumSuggestions)->take($limit)->values(),
        ]);
    }
}
