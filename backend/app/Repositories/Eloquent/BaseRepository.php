<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

abstract class BaseRepository implements BaseRepositoryInterface
{
    protected Model $model;
    protected array $with = [];
    protected string $orderByColumn = 'created_at';
    protected string $orderByDirection = 'desc';

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(array $columns = ['*']): Collection
    {
        return $this->buildQuery()->get($columns);
    }

    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->buildQuery()->paginate($perPage, $columns);
    }

    public function find(int $id, array $columns = ['*']): ?Model
    {
        return $this->buildQuery()->find($id, $columns);
    }

    public function findOrFail(int $id, array $columns = ['*']): Model
    {
        return $this->buildQuery()->findOrFail($id, $columns);
    }

    public function findBy(string $field, mixed $value, array $columns = ['*']): ?Model
    {
        return $this->buildQuery()->where($field, $value)->first($columns);
    }

    public function findByUuid(string $uuid, array $columns = ['*']): ?Model
    {
        return $this->findBy('uuid', $uuid, $columns);
    }

    public function findWhere(array $criteria, array $columns = ['*']): Collection
    {
        $query = $this->buildQuery();

        foreach ($criteria as $field => $value) {
            if (is_array($value)) {
                $query->whereIn($field, $value);
            } else {
                $query->where($field, $value);
            }
        }

        return $query->get($columns);
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $record = $this->findOrFail($id);
        $record->update($data);

        return $record->fresh();
    }

    public function delete(int $id): bool
    {
        $record = $this->findOrFail($id);

        return $record->delete();
    }

    public function forceDelete(int $id): bool
    {
        $record = $this->model->withTrashed()->findOrFail($id);

        return $record->forceDelete();
    }

    public function restore(int $id): bool
    {
        $record = $this->model->withTrashed()->findOrFail($id);

        return $record->restore();
    }

    public function with(array $relations): self
    {
        $this->with = $relations;

        return $this;
    }

    public function orderBy(string $column, string $direction = 'asc'): self
    {
        $this->orderByColumn = $column;
        $this->orderByDirection = $direction;

        return $this;
    }

    public function count(): int
    {
        return $this->buildQuery()->count();
    }

    /**
     * Build the base query with eager loading and ordering
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function buildQuery()
    {
        $query = $this->model->newQuery();

        if (!empty($this->with)) {
            $query->with($this->with);
        }

        $query->orderBy($this->orderByColumn, $this->orderByDirection);

        // Reset for next query
        $this->with = [];
        $this->orderByColumn = 'created_at';
        $this->orderByDirection = 'desc';

        return $query;
    }

    /**
     * Get a fresh instance of the model
     *
     * @return Model
     */
    public function getModel(): Model
    {
        return $this->model;
    }

    /**
     * Set the model instance
     *
     * @param Model $model
     * @return self
     */
    public function setModel(Model $model): self
    {
        $this->model = $model;

        return $this;
    }
}
