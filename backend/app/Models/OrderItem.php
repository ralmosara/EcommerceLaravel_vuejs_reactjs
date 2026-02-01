<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'album_id',
        'album_title',
        'artist_name',
        'format',
        'cover_image',
        'quantity',
        'unit_price',
        'line_total',
    ];

    protected $hidden = [
        'id',
        'order_id',
        'album_id',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'line_total' => 'decimal:2',
        ];
    }

    /**
     * Relationships
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function album()
    {
        return $this->belongsTo(Album::class);
    }
}
