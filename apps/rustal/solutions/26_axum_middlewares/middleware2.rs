// middleware2.rs solution
use axum::{
    extract::Request,
    http::StatusCode,
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use tower::ServiceExt;

async fn auth_guard(req: Request, next: Next) -> Response {
    let auth_header = req
        .headers()
        .get("authorization")
        .and_then(|val| val.to_str().ok());

    if auth_header == Some("Bearer secret-token-123") {
        next.run(req).await
    } else {
        StatusCode::UNAUTHORIZED.into_response()
    }
}

async fn protected_data() -> &'static str {
    "Confidential Vault Data"
}

pub fn create_app() -> Router {
    Router::new()
        .route("/protected", get(protected_data))
        .layer(middleware::from_fn(auth_guard))
}

fn main() {
    let _app = create_app();
    println!("Auth guard active!");
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;

    #[tokio::test]
    async fn test_auth_guard_missing_header() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/protected")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_auth_guard_invalid_token() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/protected")
                    .header("authorization", "Bearer wrong-password")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_auth_guard_valid_token() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/protected")
                    .header("authorization", "Bearer secret-token-123")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }
}
