# Concurrency & Mutex

In Rust, the type system and ownership model provide strong guarantees against data races. When multiple threads need to share and mutate data simultaneously, Rust provides synchronization primitives in `std::sync`.

- **`Mutex<T>` (Mutual Exclusion)**: Guarantees that only one thread can access the underlying data at any given moment. Access is acquired by calling `.lock().unwrap()`, which returns a `MutexGuard` smart pointer that automatically releases the lock when dropped.
- **`Arc<T>` (Atomic Reference Counting)**: Enables safe shared ownership across multiple thread boundaries (implements `Send` and `Sync` when `T` does). Often combined with `Mutex` as `Arc<Mutex<T>>`.
- **`RwLock<T>` (Reader-Writer Lock)**: Allows multiple threads to read the data concurrently (`.read().unwrap()`), or a single thread to write exclusively (`.write().unwrap()`). Ideal for read-heavy workloads.
- **`Condvar` (Condition Variable)**: Enables threads to wait for a condition to become true without burning CPU cycles in a busy-spin loop. Threads block on `cvar.wait(guard)` and are woken via `cvar.notify_one()` or `cvar.notify_all()`.

## Further Information

- [Shared-State Concurrency (The Rust Book)](https://doc.rust-lang.org/book/ch16-03-shared-state.html)
- [std::sync::Mutex Documentation](https://doc.rust-lang.org/std/sync/struct.Mutex.html)
- [std::sync::RwLock Documentation](https://doc.rust-lang.org/std/sync/struct.RwLock.html)
- [std::sync::Condvar Documentation](https://doc.rust-lang.org/std/sync/struct.Condvar.html)
