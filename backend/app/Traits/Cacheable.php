<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait Cacheable
{
    protected function cacheKey(string $suffix = ''): string
    {
        $class = class_basename($this);
        $id = $this->id ?? 'null';

        return $suffix
            ? "{$class}:{$id}:{$suffix}"
            : "{$class}:{$id}";
    }

    protected function clearModelCache(): void
    {
        $pattern = $this->cacheKey('*');
        Cache::tags([class_basename($this)])->flush();
    }

    protected function rememberCache(string $key, int $ttl, callable $callback)
    {
        return Cache::tags([class_basename($this)])->remember($key, $ttl, $callback);
    }

    protected static function bootCacheable(): void
    {
        static::updated(function ($model) {
            $model->clearModelCache();
        });

        static::deleted(function ($model) {
            $model->clearModelCache();
        });
    }
}
