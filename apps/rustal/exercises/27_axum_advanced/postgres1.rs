// postgres1.rs
//
// In web backends, database queries must always be parameterized (`$1`, `$2`, etc.)
// to prevent SQL injection vulnerabilities.
//
// In Axum, database connection pools are shared across request handlers through `State`.
//
// In this exercise:
// 1. Complete `execute_find_user_query`:
//    - Validates that `query_sql` uses the parameterized placeholder `"$1"`.
//    - Queries the database pool/store for `user_id`.
//    - Returns `Ok(user)` if found, or `Err(StatusCode::NOT_FOUND)` if not found.
// 2. Complete `get_user_handler` to extract `State(db)` and `Path(id)`, returning
//    `Result<Json<UserProfile>, StatusCode>`.
//
// Execute `rustlings hint postgres1` or use the hint tab for guidance.

use axum::{
    extract::{Path, State},
    http::{Request, StatusCode},
    routing::get,
    Json, Router,
};
use http_body_util::BodyExt;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tower::ServiceExt;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct UserProfile {
    pub id: i64,
    pub username: String,
    pub email: String,
}

// In-memory mock database state representing PostgreSQL table rows
#[derive(Clone)]
pub struct PgDatabasePool {
    users: Arc<Mutex<HashMap<i64, UserProfile>>>,
}

impl PgDatabasePool {
    pub fn new() -> Self {
        Self {
            users: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn insert_user(&self, user: UserProfile) {
        self.users.lock().unwrap().insert(user.id, user);
    }

    // Parameterized query simulation: "SELECT id, username, email FROM users WHERE id = $1"
    pub fn query_user(&self, query_sql: &str, user_id: i64) -> Result<UserProfile, StatusCode> {
        // Enforce parameterized query safety: must not contain string formatting or unparameterized queries
        if !query_sql.contains("$1") {
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }

        let store = self.users.lock().unwrap();
        store.get(&user_id).cloned().ok_or(StatusCode::NOT_FOUND)
    }
}

// TODO: Complete `get_user_handler`
async fn get_user_handler(
    State(pool): State<PgDatabasePool>,
    Path(id): Path<i64>,
) -> Result<Json<UserProfile>, StatusCode> {
    const SQL: &str = "SELECT id, username, email FROM users WHERE id = $1";
    // TODO: Call pool.query_user(SQL, id), wrap result in Json, and return
    todo!()
}

pub fn create_app(pool: PgDatabasePool) -> Router {
    Router::new()
        .route("/users/{id}", get(get_user_handler))
        .with_state(pool)
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;

    #[tokio::test]
    async fn test_query_existing_user() {
        let pool = PgDatabasePool::new();
        pool.insert_user(UserProfile {
            id: 42,
            username: "ferris".to_string(),
            email: "ferris@rust-lang.org".to_string(),
        });

        let app = create_app(pool);
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/users/42")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        let user: UserProfile = serde_json::from_slice(&body).unwrap();
        assert_eq!(
            user,
            UserProfile {
                id: 42,
                username: "ferris".to_string(),
                email: "ferris@rust-lang.org".to_string(),
            }
        );
    }

    #[tokio::test]
    async fn test_query_nonexistent_user_returns_404() {
        let pool = PgDatabasePool::new();
        let app = create_app(pool);

        let response = app
            .oneshot(
                Request::builder()
                    .uri("/users/999")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }
}
