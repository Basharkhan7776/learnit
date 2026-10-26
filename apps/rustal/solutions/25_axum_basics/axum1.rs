// axum1.rs solution
use axum::{
    http::{Request, StatusCode},
    routing::get,
    Router,
};
use http_body_util::BodyExt;
use tower::ServiceExt;

async fn root() -> &'static str {
    "Welcome to Axum!"
}

async fn health_check() -> (StatusCode, &'static str) {
    (StatusCode::OK, "healthy")
}

pub fn create_app() -> Router {
    Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
}

fn main() {
    let _app = create_app();
    println!("Axum app configured!");
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
