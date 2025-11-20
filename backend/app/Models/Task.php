<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',
        'due_date',
        'priority',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    protected $appends = ['priority_string'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get priority as string
     */
    public function getPriorityStringAttribute(): string
    {
        return match ($this->attributes['priority']) {
            0 => 'low',
            1 => 'medium',
            2 => 'high',
            default => 'low',
        };
    }

    /**
     * Set priority from string
     */
    public function setPriorityAttribute($value): void
    {
        if (is_string($value)) {
            $this->attributes['priority'] = match (strtolower($value)) {
                'low' => 0,
                'medium' => 1,
                'high' => 2,
                default => 0,
            };
        } else {
            $this->attributes['priority'] = (int) $value;
        }
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeDueSoon($query, int $days = 7)
    {
        return $query->whereBetween('due_date', [now(), now()->addDays($days)]);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date && $this->due_date->isPast() && $this->status !== 'completed';
    }
}
