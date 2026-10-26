// postgres2.rs
//
// In transactional databases like PostgreSQL, multiple mutations must be grouped
// into atomic transactions (`BEGIN ... COMMIT`). If an invariant fails
// (e.g., negative balance, missing destination), the transaction must ROLLBACK,
// guaranteeing that no partial changes corrupt database integrity.
//
// In this exercise:
// 1. Complete `execute_transfer_transaction`:
//    - Look up both `from_id` and `to_id` in accounts.
//    - If either account is missing, return `Err(StatusCode::NOT_FOUND)`.
//    - If `from_account.balance < amount`, return `Err(StatusCode::UNPROCESSABLE_ENTITY)`
//      without altering any balances (ROLLBACK).
//    - If valid, deduct `amount` from `from_account` and credit `to_account` (COMMIT).
// 2. Connect the transaction logic to `transfer_handler`.
//
// Execute `rustlings hint postgres2` or use the hint tab for guidance.

use axum::{
    extract::State,
    http::{Request, StatusCode},
    routing::post,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tower::ServiceExt;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransferRequest {
    pub from_id: i64,
    pub to_id: i64,
    pub amount: u64,
}

#[derive(Clone)]
pub struct AccountStore {
    pub accounts: Arc<Mutex<HashMap<i64, u64>>>,
}

impl AccountStore {
    pub fn new() -> Self {
        Self {
            accounts: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn set_balance(&self, id: i64, balance: u64) {
        self.accounts.lock().unwrap().insert(id, balance);
    }

    pub fn get_balance(&self, id: i64) -> Option<u64> {
        self.accounts.lock().unwrap().get(&id).copied()
    }

    // Transaction execution
    pub fn execute_transfer_transaction(
        &self,
        from_id: i64,
        to_id: i64,
        amount: u64,
    ) -> Result<(), StatusCode> {
        let mut store = self.accounts.lock().unwrap();

        // 1. Check if both accounts exist
        let from_balance = store.get(&from_id).copied().ok_or(StatusCode::NOT_FOUND)?;
        let to_balance = store.get(&to_id).copied().ok_or(StatusCode::NOT_FOUND)?;

        // TODO: Enforce balance constraint:
        // If `from_balance < amount`, return `Err(StatusCode::UNPROCESSABLE_ENTITY)`
        // without making any changes!

        // TODO: Commit: deduct amount from `from_id`, add to `to_id`

        todo!()
    }
}

async fn transfer_handler(
    State(store): State<AccountStore>,
    Json(payload): Json<TransferRequest>,
) -> StatusCode {
    match store.execute_transfer_transaction(payload.from_id, payload.to_id, payload.amount) {
        Ok(()) => StatusCode::OK,
        Err(status) => status,
    }
}

pub fn create_app(store: AccountStore) -> Router {
    Router::new()
        .route("/transfer", post(transfer_handler))
        .with_state(store)
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;

    #[tokio::test]
    async fn test_successful_transfer_commits() {
        let store = AccountStore::new();
        store.set_balance(1, 500);
        store.set_balance(2, 100);

        let app = create_app(store.clone());
        let payload = r#"{"from_id":1,"to_id":2,"amount":150}"#;

        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/transfer")
                    .header("content-type", "application/json")
                    .body(Body::from(payload))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(store.get_balance(1), Some(350));
        assert_eq!(store.get_balance(2), Some(250));
    }

    #[tokio::test]
    async fn test_insufficient_balance_rolls_back() {
        let store = AccountStore::new();
        store.set_balance(1, 50);
        store.set_balance(2, 100);

        let app = create_app(store.clone());
        let payload = r#"{"from_id":1,"to_id":2,"amount":200}"#;

        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/transfer")
                    .header("content-type", "application/json")
                    .body(Body::from(payload))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);
        // Balances must remain strictly unchanged
        assert_eq!(store.get_balance(1), Some(50));
        assert_eq!(store.get_balance(2), Some(100));
    }
}
