// axum1.rs
//
// Welcome to Axum! In Axum, web applications are built using `Router` and async handlers.
//
// In this exercise, create an Axum router with two routes:
// 1. `GET /`: returns the plain string `"Welcome to Axum!"`
// 2. `GET /health`: returns `StatusCode::OK` with body `"healthy"`
//
// Note: Axum routers implement Tower's `Service` trait, so we can test them in-memory
// using `app.oneshot(request).await` without opening real TCP network ports!
//
// Execute `rustlings hint axum1` or use the hint tab for guidance.

use axum::{
    http::{Request, StatusCode},
    routing::get,
    Router,
};
use http_body_util::BodyExt;
use tower::ServiceExt;

// TODO: Implement the `root` handler. It should be an async function returning &'static str.
async fn root() -> &'static str {
    // "Welcome to Axum!"
    todo!()
}

// TODO: Implement the `health_check` handler.
async fn health_check() -> (StatusCode, &'static str) {
    // (StatusCode::OK, "healthy")
    todo!()
}

pub fn create_app() -> Router {
    // TODO: Build and return a Router with the two routes registered:
    // - "/" -> get(root)
    // - "/health" -> get(health_check)
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
    async fn test_root_endpoint() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        assert_eq!(&body[..], b"Welcome to Axum!");
    }

    #[tokio::test]
    async fn test_health_endpoint() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/health")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        assert_eq!(&body[..], b"healthy");
    }
}
