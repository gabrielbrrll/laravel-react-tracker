<?php

namespace App\Http\Resources;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Task
 */
class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority_string, // Return string instead of integer
            'due_date' => $this->due_date?->format('Y-m-d'),
            'is_overdue' => $this->is_overdue,
            'user' => [
                'id' => $this->user->id, // @phpstan-ignore property.notFound
                'name' => $this->user->name, // @phpstan-ignore property.notFound
            ],
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
