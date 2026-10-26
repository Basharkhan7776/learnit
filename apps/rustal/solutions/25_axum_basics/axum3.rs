// axum3.rs solution
use axum::{
    extract::Json,
    http::{Request, StatusCode},
    routing::post,
    Router,
};
use http_body_util::BodyExt;
use serde::{Deserialize, Serialize};
use tower::ServiceExt;

#[derive(Debug, Deserialize)]
pub struct CreateItemPayload {
    pub name: String,
    pub price: u32,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct ItemResponse {
    pub id: u64,
    pub name: String,
    pub price: u32,
}

async fn create_item(
    Json(payload): Json<CreateItemPayload>,
) -> Result<(StatusCode, Json<ItemResponse>), StatusCode> {
    if payload.name.is_empty() || payload.price == 0 {
        return Err(StatusCode::BAD_REQUEST);
    }

    let response = ItemResponse {
        id: 101,
        name: payload.name,
        price: payload.price,
    };

    Ok((StatusCode::CREATED, Json(response)))
}

pub fn create_app() -> Router {
    Router::new().route("/items", post(create_item))
}

fn main() {
    let _app = create_app();
    println!("Item API configured!");
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
