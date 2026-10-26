// mutex3.rs
//
// A `Mutex` allows only one thread to access data at a time, regardless of whether
// it is reading or writing. For read-heavy workloads, this can create severe bottlenecks.
//
// `std::sync::RwLock` (Read-Write Lock) solves this by allowing:
// - Multiple concurrent readers via `.read().unwrap()`
// - OR a single exclusive writer via `.write().unwrap()`
//
// Refactor the `Cache` struct below to use `RwLock` instead of `Mutex`.
//
// Execute `rustlings hint mutex3` or use the hint tab for guidance.

use std::collections::HashMap;
// TODO: Import RwLock from std::sync
use std::sync::{Arc, Mutex};
use std::thread;

pub struct Cache {
    // TODO: Change Mutex to RwLock
    store: Mutex<HashMap<String, String>>,
}

impl Cache {
    pub fn new() -> Self {
        Self {
            store: Mutex::new(HashMap::new()),
        }
    }

    pub fn get(&self, key: &str) -> Option<String> {
        // TODO: Acquire a shared read lock instead of an exclusive lock
        let guard = self.store.lock().unwrap();
        guard.get(key).cloned()
    }

    pub fn insert(&self, key: String, value: String) {
        // TODO: Acquire an exclusive write lock
        let mut guard = self.store.lock().unwrap();
        guard.insert(key, value);
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rwlock_cache() {
        let cache = Arc::new(Cache::new());
        cache.insert("user:1".to_string(), "Alice".to_string());

        let mut handles = vec![];

        // Spawn multiple concurrent reader threads
        for _ in 0..10 {
            let c = Arc::clone(&cache);
            handles.push(thread::spawn(move || {
                for _ in 0..50 {
                    let val = c.get("user:1");
                    assert_eq!(val, Some("Alice".to_string()));
                }
            }));
        }

        // Spawn an updater thread
        let c_writer = Arc::clone(&cache);
        handles.push(thread::spawn(move || {
            c_writer.insert("user:2".to_string(), "Bob".to_string());
        }));

        for h in handles {
            h.join().unwrap();
        }

        assert_eq!(cache.get("user:2"), Some("Bob".to_string()));
    }
}
