// axum4.rs
//
// In web servers, multiple requests are handled concurrently across worker threads.
// To share data (like in-memory caches, lists, or connection pools), Axum provides the
// `State` extractor, which pairs naturally with `Arc<Mutex<T>>`.
//
// In this exercise:
// 1. Create `AppState` containing `Arc<Mutex<Vec<String>>>`.
// 2. Implement `add_todo`:
//    - Extracts `State(state): State<AppState>` and `body: String`.
//    - Locks the mutex and appends the todo item.
//    - Returns `StatusCode::CREATED`.
// 3. Implement `get_todo_count`:
//    - Extracts `State(state): State<AppState>`.
//    - Locks the mutex and returns the length of the list as a formatted string: `format!("{}", len)`.
// 4. Attach state to the router using `.with_state(state)`.
//
// Execute `rustlings hint axum4` or use the hint tab for guidance.

use axum::{
    extract::State,
    http::{Request, StatusCode},
    routing::{get, post},
    Router,
};
use http_body_util::BodyExt;
use std::sync::{Arc, Mutex};
use tower::ServiceExt;

#[derive(Clone)]
pub struct AppState {
    pub todos: Arc<Mutex<Vec<String>>>,
}

// TODO: Implement `add_todo` handler taking `State(state): State<AppState>` and `body: String`
async fn add_todo(State(state): State<AppState>, body: String) -> StatusCode {
    todo!()
}

// TODO: Implement `get_todo_count` handler taking `State(state): State<AppState>` and returning String
async fn get_todo_count(State(state): State<AppState>) -> String {
    todo!()
}

pub fn create_app(state: AppState) -> Router {
    // TODO: Register routes `POST /todos` and `GET /todos/count`, and attach `state` with `.with_state(state)`
    Router::new()
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;

    #[tokio::test]
    async fn test_shared_state_mutation_and_read() {
        let state = AppState {
            todos: Arc::new(Mutex::new(Vec::new())),
        };
        let app = create_app(state.clone());

        // 1. Initially count should be 0
        let res = app
            .clone()
            .oneshot(
                Request::builder()
                    .uri("/todos/count")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(res.status(), StatusCode::OK);
        let body = res.into_body().collect().await.unwrap().to_bytes();
        assert_eq!(&body[..], b"0");

        // 2. Add first todo
        let res = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/todos")
                    .body(Body::from("Learn Rustlings"))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(res.status(), StatusCode::CREATED);

        // 3. Add second todo
        let res = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/todos")
                    .body(Body::from("Master Axum"))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(res.status(), StatusCode::CREATED);

        // 4. Count should now be 2
        let res = app
            .oneshot(
                Request::builder()
                    .uri("/todos/count")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(res.status(), StatusCode::OK);
        let body = res.into_body().collect().await.unwrap().to_bytes();
        assert_eq!(&body[..], b"2");

        // Verify underlying shared mutex state directly
        let stored = state.todos.lock().unwrap();
        assert_eq!(
            *stored,
            vec!["Learn Rustlings".to_string(), "Master Axum".to_string()]
        );
    }
}
