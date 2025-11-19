<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed', 'cancelled'])],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'priority' => ['required', 'integer', 'between:0,2'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Please provide a task title.',
            'due_date.after_or_equal' => 'Due date cannot be in the past.',
        ];
    }
}
