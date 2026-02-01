<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Store an uploaded image
     *
     * @param UploadedFile $file The uploaded file
     * @param string $directory Base directory (e.g., 'albums')
     * @param string|null $oldPath Optional old image path to delete
     * @return string The stored file path
     */
    public function store(UploadedFile $file, string $directory, ?string $oldPath = null): string
    {
        // Delete old image if provided
        if ($oldPath) {
            $this->delete($oldPath);
        }

        // Generate unique path
        $path = $this->generatePath($directory, $file);

        // Store the file
        Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));

        return $path;
    }

    /**
     * Delete an image from storage
     *
     * @param string $path The file path to delete
     * @return bool
     */
    public function delete(string $path): bool
    {
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }

    /**
     * Generate a unique storage path for an uploaded file
     *
     * @param string $directory Base directory
     * @param UploadedFile $file The uploaded file
     * @return string The generated path
     */
    public function generatePath(string $directory, UploadedFile $file): string
    {
        $uuid = Str::uuid()->toString();
        $extension = $file->getClientOriginalExtension();

        return "{$directory}/{$uuid}/cover.{$extension}";
    }

    /**
     * Get the public URL for a stored image
     *
     * @param string|null $path The file path
     * @return string|null
     */
    public function getUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        return asset('storage/' . $path);
    }
}
