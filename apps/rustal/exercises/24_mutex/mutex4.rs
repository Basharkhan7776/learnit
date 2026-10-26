// mutex4.rs
//
// In multi-threaded programs, busy-waiting (looping repeatedly checking if data is ready)
// wastes CPU cycles.
//
// A `Condvar` (Condition Variable) allows a thread to sleep until a specific condition
// is signaled by another thread. It is always paired with a `Mutex`.
//
// In this exercise, complete the `WorkQueue` methods:
// 1. `push_work`: Pushes a task to the queue and notifies a waiting worker using `notify_one()`.
// 2. `pop_work`: Waits on the Condvar while the queue is empty, then pops and returns a task.
//
// Execute `rustlings hint mutex4` or use the hint tab for guidance.

use std::collections::VecDeque;
use std::sync::{Arc, Condvar, Mutex};
use std::thread;
use std::time::Duration;

pub struct WorkQueue {
    queue: Mutex<VecDeque<String>>,
    condvar: Condvar,
}

impl WorkQueue {
    pub fn new() -> Self {
        Self {
            queue: Mutex::new(VecDeque::new()),
            condvar: Condvar::new(),
        }
    }

    pub fn push_work(&self, task: String) {
        let mut q = self.queue.lock().unwrap();
        q.push_back(task);
        // TODO: Notify a waiting thread that work is available using `self.condvar`!
    }

    pub fn pop_work(&self) -> String {
        let mut q = self.queue.lock().unwrap();
        // TODO: While the queue is empty, wait on the condvar!
        // Remember: `self.condvar.wait(q).unwrap()` consumes the MutexGuard and returns
        // a re-acquired MutexGuard when woken up.
        while q.is_empty() {
            // q = self.condvar.wait(q).unwrap();
            panic!("Queue is empty! Use Condvar to wait for work.");
        }
        q.pop_front().unwrap()
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_work_queue_condvar() {
        let work_queue = Arc::new(WorkQueue::new());
        let consumer_queue = Arc::clone(&work_queue);

        let consumer = thread::spawn(move || {
            let task1 = consumer_queue.pop_work();
            let task2 = consumer_queue.pop_work();
            vec![task1, task2]
        });

        // Sleep briefly to ensure consumer thread starts and blocks on condvar
        thread::sleep(Duration::from_millis(50));

        work_queue.push_work("task-alpha".to_string());
        thread::sleep(Duration::from_millis(20));
        work_queue.push_work("task-beta".to_string());

        let results = consumer.join().unwrap();
        assert_eq!(results, vec!["task-alpha", "task-beta"]);
    }
}
