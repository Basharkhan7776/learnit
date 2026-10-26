// mutex2.rs
//
// Deadlock occurs when two or more threads are waiting on each other to release
// a lock, causing a program to freeze indefinitely.
//
// In this exercise, two bank accounts transfer money between each other concurrently.
// If thread 1 transfers from Account 1 to Account 2, it locks Account 1 then Account 2.
// If thread 2 simultaneously transfers from Account 2 to Account 1, it locks Account 2 then Account 1.
// This causes a classic circular deadlock!
//
// Fix the `transfer` function by ensuring locks are ALWAYS acquired in a deterministic order
// (e.g. locking the account with the smaller ID first).
//
// Execute `rustlings hint mutex2` or use the hint tab for guidance.

use std::sync::{Arc, Mutex};
use std::thread;

pub struct Account {
    pub id: u32,
    pub balance: Mutex<u32>,
}

pub fn transfer(from: &Account, to: &Account, amount: u32) -> Result<(), &'static str> {
    if from.id == to.id {
        return Err("Cannot transfer to the same account");
    }

    // TODO: This naive implementation acquires `from.balance` first, then `to.balance`.
    // When two threads transfer in opposite directions at the same time, this deadlocks!
    // Refactor this section to acquire locks in order of `id` (e.g. lower ID first).
    let mut from_guard = from.balance.lock().unwrap();
    let mut to_guard = to.balance.lock().unwrap();

    if *from_guard < amount {
        return Err("Insufficient funds");
    }

    *from_guard -= amount;
    *to_guard += amount;

    Ok(())
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_concurrent_transfers_no_deadlock() {
        let acc1 = Arc::new(Account {
            id: 1,
            balance: Mutex::new(1000),
        });
        let acc2 = Arc::new(Account {
            id: 2,
            balance: Mutex::new(1000),
        });

        let mut handles = vec![];

        // Spawn 20 threads transferring acc1 -> acc2
        for _ in 0..20 {
            let a1 = Arc::clone(&acc1);
            let a2 = Arc::clone(&acc2);
            handles.push(thread::spawn(move || {
                for _ in 0..50 {
                    let _ = transfer(&a1, &a2, 5);
                }
            }));
        }

        // Spawn 20 threads transferring acc2 -> acc1 simultaneously
        for _ in 0..20 {
            let a1 = Arc::clone(&acc1);
            let a2 = Arc::clone(&acc2);
            handles.push(thread::spawn(move || {
                for _ in 0..50 {
                    let _ = transfer(&a2, &a1, 5);
                }
            }));
        }

        for h in handles {
            h.join().unwrap();
        }

        let total = *acc1.balance.lock().unwrap() + *acc2.balance.lock().unwrap();
        assert_eq!(total, 2000, "Total money across accounts must be conserved");
    }
}
