<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * All of the container bindings that should be registered.
     *
     * @var array
     */
    public array $bindings = [
        // Base repository
        \App\Repositories\Contracts\BaseRepositoryInterface::class => \App\Repositories\Eloquent\BaseRepository::class,

        // Entity repositories
        \App\Repositories\Contracts\ArtistRepositoryInterface::class => \App\Repositories\Eloquent\ArtistRepository::class,
        \App\Repositories\Contracts\GenreRepositoryInterface::class => \App\Repositories\Eloquent\GenreRepository::class,
        \App\Repositories\Contracts\AlbumRepositoryInterface::class => \App\Repositories\Eloquent\AlbumRepository::class,
        \App\Repositories\Contracts\UserRepositoryInterface::class => \App\Repositories\Eloquent\UserRepository::class,
        \App\Repositories\Contracts\AddressRepositoryInterface::class => \App\Repositories\Eloquent\AddressRepository::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function bootstrap(): void
    {
        //
    }
}
