// axum4.rs solution
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

async fn add_todo(State(state): State<AppState>, body: String) -> StatusCode {
    let mut todos = state.todos.lock().unwrap();
    todos.push(body);
    StatusCode::CREATED
}

async fn get_todo_count(State(state): State<AppState>) -> String {
    let todos = state.todos.lock().unwrap();
    format!("{}", todos.len())
}

pub fn create_app(state: AppState) -> Router {
    Router::new()
        .route("/todos", post(add_todo))
        .route("/todos/count", get(get_todo_count))
        .with_state(state)
}

fn main() {
    let state = AppState {
        todos: Arc::new(Mutex::new(Vec::new())),
    };
    let _app = create_app(state);
    println!("Stateful app ready!");
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

        let stored = state.todos.lock().unwrap();
        assert_eq!(
            *stored,
            vec!["Learn Rustlings".to_string(), "Master Axum".to_string()]
        );
    }
}
