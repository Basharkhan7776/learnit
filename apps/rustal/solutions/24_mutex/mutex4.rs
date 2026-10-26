// mutex4.rs solution
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
        self.condvar.notify_one();
    }

    pub fn pop_work(&self) -> String {
        let mut q = self.queue.lock().unwrap();
        while q.is_empty() {
            q = self.condvar.wait(q).unwrap();
        }
        q.pop_front().unwrap()
    }
}

fn main() {
    let q = WorkQueue::new();
    q.push_work("init".to_string());
    println!("Work: {}", q.pop_work());
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

        thread::sleep(Duration::from_millis(50));

        work_queue.push_work("task-alpha".to_string());
        thread::sleep(Duration::from_millis(20));
        work_queue.push_work("task-beta".to_string());

        let results = consumer.join().unwrap();
        assert_eq!(results, vec!["task-alpha", "task-beta"]);
    }
}
