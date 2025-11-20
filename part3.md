# Part 3 — System Design

## 1. How would you scale this app for 100k+ users?

### Infrastructure
- **Load Balancer:** Distribute traffic across app servers.
- **App Servers:** Auto-scaling group (min 2 instances) for high availability.
- **Database:** Managed PostgreSQL (e.g., AWS RDS).
  - *Scale Up:* Increase instance size first (Vertical Scaling).
  - *Scale Out:* Add a read replica if read traffic becomes a bottleneck.
- **Redis:** Managed Redis for sessions, cache, and queues.
- **CDN:** Serve static assets (JS, CSS, images) to reduce server load.

### Application Layer
```
[Users] → [CDN] → [Load Balancer] → [App Servers (Auto-scaling)]
                                        ↓
                            [Redis] ← [PostgreSQL] → [Read Replica (Optional)]
                                        ↓
                                   [Queue Workers]
```

### Key Changes
- **Stateless Sessions:** Store sessions in Redis.
- **Queue Workers:** Offload heavy tasks (emails, exports) to background jobs.
- **Asset Optimization:** Minify/bundle assets, use lazy loading.

### Database Optimization
- **Indexing:** Crucial for performance (see Section 3).
- **N+1 Prevention:** Strict use of eager loading.
- **Connection Pooling:** Use PgBouncer if connection limits are hit.

### Monitoring
- **APM:** New Relic / Sentry / Laravel Telescope.
- **Logs:** Centralized logging.
- **Alerts:** CPU, Memory, Error Rates.

---

## 2. How would you implement background jobs (e.g., reminders)?

### Queue Setup
Use Redis as the queue driver for speed and reliability.

```bash
# .env
QUEUE_CONNECTION=redis
```

### Reminder Job
Create a job class to handle the logic.

```php
// app/Jobs/SendTaskReminderJob.php
class SendTaskReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Task $task) {}

    public function handle(): void
    {
        // Send email only if still relevant
        if ($this->task->status !== 'completed') {
             Mail::to($this->task->user)->send(new TaskReminderMail($this->task));
        }
    }
}
```

### Scheduling
Use Laravel's Scheduler to dispatch jobs.

```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule): void
{
    // Run daily at 9 AM
    $schedule->call(function () {
        // Chunking prevents memory issues
        Task::where('status', '!=', 'completed')
            ->whereDate('due_date', now()->addDay())
            ->chunk(100, function ($tasks) {
                foreach ($tasks as $task) {
                    SendTaskReminderJob::dispatch($task);
                }
            });
    })->dailyAt('09:00');
}
```

### Worker Configuration
Run workers with Supervisor in production to ensure they stay alive.

```ini
[program:laravel-worker]
command=php /path/to/artisan queue:work redis --tries=3
autostart=true
autorestart=true
numprocs=2
```

---

## 3. How would you optimize database queries and caching?

### Query Optimization (The 80/20 Rule)

1.  **Eager Loading (Prevent N+1):**
    ```php
    // ❌ Bad
    $tasks = Task::all(); // Loop causes N queries

    // ✅ Good
    $tasks = Task::with('user')->get(); // 2 queries
    ```

2.  **Select Only What You Need:**
    ```php
    Task::select('id', 'title', 'status')->get();
    ```

3.  **Indexing:**
    Add indexes to columns used in `WHERE`, `ORDER BY`, and `JOIN` clauses.
    ```php
    $table->index(['user_id', 'status']); // Compound index for filtering
    ```

### Caching Strategy

**Don't over-engineer.** Cache expensive calculations or static data, not everything.

1.  **Cache Expensive Aggregates:**
    Dashboard stats are a perfect candidate.
    ```php
    public function getStats(User $user)
    {
        return Cache::remember("user:{$user->id}:stats", 600, function () use ($user) {
            return [
                'total' => $user->tasks()->count(),
                'pending' => $user->tasks()->where('status', 'pending')->count(),
                // ... other counts
            ];
        });
    }
    ```

2.  **Invalidation:**
    Use Model Observers to clear specific cache keys when data changes.
    ```php
    // TaskObserver
    public function saved(Task $task)
    {
        Cache::forget("user:{$task->user_id}:stats");
    }
    ```

### Summary
1.  **Database First:** optimize queries and indexes before reaching for cache.
2.  **Queues:** Move slow work out of the web request.
3.  **Simple Cache:** Cache aggregates and config, avoid complex query caching unless necessary.
