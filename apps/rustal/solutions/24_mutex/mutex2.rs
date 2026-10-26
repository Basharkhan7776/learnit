// mutex2.rs solution
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

    // Always acquire the lock with the lower id first to prevent circular deadlocks
    if from.id < to.id {
        let mut from_guard = from.balance.lock().unwrap();
        let mut to_guard = to.balance.lock().unwrap();

        if *from_guard < amount {
            return Err("Insufficient funds");
        }
        *from_guard -= amount;
        *to_guard += amount;
    } else {
        let mut to_guard = to.balance.lock().unwrap();
        let mut from_guard = from.balance.lock().unwrap();

        if *from_guard < amount {
            return Err("Insufficient funds");
        }
        *from_guard -= amount;
        *to_guard += amount;
    }

    Ok(())
}

fn main() {
    let acc1 = Account {
        id: 1,
        balance: Mutex::new(100),
    };
    let acc2 = Account {
        id: 2,
        balance: Mutex::new(100),
    };
    transfer(&acc1, &acc2, 50).unwrap();
    println!("Acc 1: {}, Acc 2: {}", *acc1.balance.lock().unwrap(), *acc2.balance.lock().unwrap());
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

        for _ in 0..20 {
            let a1 = Arc::clone(&acc1);
            let a2 = Arc::clone(&acc2);
            handles.push(thread::spawn(move || {
                for _ in 0..50 {
                    let _ = transfer(&a1, &a2, 5);
                }
            }));
        }

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
