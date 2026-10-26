// mutex3.rs solution
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use std::thread;

pub struct Cache {
    store: RwLock<HashMap<String, String>>,
}

impl Cache {
    pub fn new() -> Self {
        Self {
            store: RwLock::new(HashMap::new()),
        }
    }

    pub fn get(&self, key: &str) -> Option<String> {
        let guard = self.store.read().unwrap();
        guard.get(key).cloned()
    }

    pub fn insert(&self, key: String, value: String) {
        let mut guard = self.store.write().unwrap();
        guard.insert(key, value);
    }
}

fn main() {
    let cache = Cache::new();
    cache.insert("lang".to_string(), "Rust".to_string());
    println!("Language: {:?}", cache.get("lang"));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rwlock_cache() {
        let cache = Arc::new(Cache::new());
        cache.insert("user:1".to_string(), "Alice".to_string());

        let mut handles = vec![];

        for _ in 0..10 {
            let c = Arc::clone(&cache);
            handles.push(thread::spawn(move || {
                for _ in 0..50 {
                    let val = c.get("user:1");
                    assert_eq!(val, Some("Alice".to_string()));
                }
            }));
        }

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
