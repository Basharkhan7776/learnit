// mutex1.rs solution
use std::sync::{Arc, Mutex};
use std::thread;

fn increment_counter(counter: Arc<Mutex<u32>>) {
    let mut handles = vec![];

    for _ in 0..10 {
        let counter_clone = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            for _ in 0..100 {
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
    let counter = Arc::new(Mutex::new(0));
    increment_counter(Arc::clone(&counter));
    println!("Counter: {}", *counter.lock().unwrap());
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
