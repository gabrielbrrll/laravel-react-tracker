<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TaskService
{
    public function getAllTasks(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = Task::forUser($user->id)->with('user');

        if (isset($filters['status'])) {
            $query->byStatus($filters['status']);
        }

        if (isset($filters['due_date'])) {
            $query->whereDate('due_date', $filters['due_date']);
        }

        if (isset($filters['overdue']) && $filters['overdue']) {
            $query->where('due_date', '<', now())
                ->where('status', '!=', 'completed');
        }

        if (isset($filters['priority'])) {
            // Convert string priority to integer for database comparison
            $priorityMap = ['low' => 0, 'medium' => 1, 'high' => 2];
            $priority = is_string($filters['priority'])
                ? ($priorityMap[$filters['priority']] ?? $filters['priority'])
                : $filters['priority'];
            $query->where('priority', $priority);
        }

        // Search filter
        $hasSearch = isset($filters['search']) && ! empty($filters['search']);
        if ($hasSearch) {
            $search = strtolower($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"]);
            });
        }

        // Sorting - user's sort preference takes precedence
        $allowedSortColumns = ['created_at', 'due_date', 'priority', 'status', 'title'];
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortBy = in_array($sortBy, $allowedSortColumns) ? $sortBy : 'created_at';

        $sortOrder = $filters['sort_order'] ?? 'desc';
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';

        // Apply user's primary sort
        $query->orderBy($sortBy, $sortOrder);

        // If searching and no explicit sort_by provided, add search relevance as secondary sort
        if ($hasSearch && ! isset($filters['sort_by'])) {
            $search = strtolower($filters['search']);
            $query->orderByRaw('
                CASE
                    WHEN LOWER(title) LIKE ? THEN 1
                    WHEN LOWER(description) LIKE ? THEN 2
                    ELSE 3
                END
            ', ["%{$search}%", "%{$search}%"]);
        }

        $perPage = $filters['per_page'] ?? 15;

        return $query->paginate($perPage);
    }

    public function createTask(User $user, array $data): Task
    {
        $task = new Task($data);
        $task->user_id = $user->id;
        $task->save();

        return $task;
    }

    public function updateTask(Task $task, array $data): Task
    {
        $task->update($data);

        return $task->fresh();
    }

    public function deleteTask(Task $task): bool
    {
        return $task->delete();
    }

    public function getTaskStatistics(User $user): array
    {
        $tasks = Task::forUser($user->id);

        return [
            'total' => $tasks->count(),
            'pending' => $tasks->clone()->byStatus('pending')->count(),
            'in_progress' => $tasks->clone()->byStatus('in_progress')->count(),
            'completed' => $tasks->clone()->byStatus('completed')->count(),
            'overdue' => $tasks->clone()->where('due_date', '<', now())
                ->where('status', '!=', 'completed')->count(),
        ];
    }
}
