// axum3.rs
//
// Modern APIs frequently process structured payloads like JSON and query parameters.
// Axum integrates with `serde` through the `Json` and `Query` extractors.
//
// In this exercise:
// 1. Add necessary serde derives to `CreateItemPayload` and `ItemResponse`.
// 2. Implement `create_item`:
//    - Extracts `Json<CreateItemPayload>`.
//    - If `payload.name` is empty or `payload.price == 0`, return `Err(StatusCode::BAD_REQUEST)`.
//    - Otherwise return `Ok((StatusCode::CREATED, Json(ItemResponse { id: 101, name: payload.name, price: payload.price })))`.
// 3. Register route `POST /items` in `create_app()`.
//
// Execute `rustlings hint axum3` or use the hint tab for guidance.

use axum::{
    extract::Json,
    http::{Request, StatusCode},
    routing::post,
    Router,
};
use http_body_util::BodyExt;
use serde::{Deserialize, Serialize};
use tower::ServiceExt;

// TODO: Add derive macro for deserializing incoming JSON
#[derive(Debug)]
pub struct CreateItemPayload {
    pub name: String,
    pub price: u32,
}

// TODO: Add derive macros for serializing JSON response and equality testing
#[derive(Debug)]
pub struct ItemResponse {
    pub id: u64,
    pub name: String,
    pub price: u32,
}

// TODO: Implement the handler `create_item`.
async fn create_item(
    Json(payload): Json<CreateItemPayload>,
) -> Result<(StatusCode, Json<ItemResponse>), StatusCode> {
    todo!()
}

pub fn create_app() -> Router {
    // TODO: Register `POST /items` with `create_item` handler
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
    async fn test_create_item_success() {
        let app = create_app();
        let payload = r#"{"name":"Rust Programming Book","price":45}"#;

        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/items")
                    .header("content-type", "application/json")
                    .body(Body::from(payload))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::CREATED);
        let body_bytes = response.into_body().collect().await.unwrap().to_bytes();
        let created: ItemResponse = serde_json::from_slice(&body_bytes).unwrap();
        assert_eq!(
            created,
            ItemResponse {
                id: 101,
                name: "Rust Programming Book".to_string(),
                price: 45
            }
        );
    }

    #[tokio::test]
    async fn test_create_item_validation_failure() {
        let app = create_app();
        let payload = r#"{"name":"","price":0}"#;

        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/items")
                    .header("content-type", "application/json")
                    .body(Body::from(payload))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    }
}
