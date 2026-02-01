<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        foreach ($filters as $key => $value) {
            if (method_exists($this, $method = 'filter' . ucfirst($key))) {
                $this->$method($query, $value);
            }
        }

        return $query;
    }

    public function scopeSearch(Builder $query, string $term): Builder
    {
        if (empty($this->searchable)) {
            return $query;
        }

        return $query->where(function ($q) use ($term) {
            foreach ($this->searchable as $field) {
                $q->orWhere($field, 'LIKE', "%{$term}%");
            }
        });
    }

    public function scopeSortBy(Builder $query, string $field, string $direction = 'asc'): Builder
    {
        $allowedSorts = $this->sortable ?? ['id', 'created_at'];

        if (!in_array($field, $allowedSorts)) {
            $field = 'created_at';
        }

        $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

        return $query->orderBy($field, $direction);
    }
}
