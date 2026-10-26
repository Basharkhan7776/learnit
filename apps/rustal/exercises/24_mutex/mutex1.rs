// mutex1.rs
//
// Multiple threads need to safely mutate a shared counter.
// Currently, `counter` is wrapped in an `Arc<u32>`, but `Arc` alone only provides
// shared immutable access.
//
// Wrap the counter in a `Mutex` inside the `Arc`, acquire the lock before incrementing,
// and get all threads to increment the counter 100 times each.
//
// Execute `rustlings hint mutex1` or use the hint tab for guidance.

use std::sync::{Arc, Mutex};
use std::thread;

fn increment_counter(counter: Arc<Mutex<u32>>) {
    let mut handles = vec![];

    for _ in 0..10 {
        let counter_clone = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            for _ in 0..100 {
                // TODO: Acquire the lock and increment the counter by 1.
                // Remember that lock() returns a Result containing a MutexGuard.
                let mut num = counter_clone.lock().unwrap();
                *num += 1;
            }
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_counter() {
        let counter = Arc::new(Mutex::new(0));
        increment_counter(Arc::clone(&counter));
        assert_eq!(*counter.lock().unwrap(), 1000);
    }
}
