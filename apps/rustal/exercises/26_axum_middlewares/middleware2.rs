// middleware2.rs
//
// Middlewares can short-circuit requests (returning an early error response)
// before the request reaches sensitive route handlers. This is the foundation
// of authentication and authorization guards.
//
// In this exercise:
// 1. Implement `auth_guard` middleware:
//    - Look up the `"authorization"` header on `req.headers()`.
//    - If the header is missing OR does not equal `"Bearer secret-token-123"`,
//      immediately return `StatusCode::UNAUTHORIZED.into_response()`.
//    - If valid, forward the request by returning `next.run(req).await`.
// 2. Attach `auth_guard` to the `/protected` route in `create_app()`.
//
// Execute `rustlings hint middleware2` or use the hint tab for guidance.

use axum::{
    extract::Request,
    http::StatusCode,
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use tower::ServiceExt;

// TODO: Implement `auth_guard`
async fn auth_guard(req: Request, next: Next) -> Response {
    todo!()
}

async fn protected_data() -> &'static str {
    "Confidential Vault Data"
}

pub fn create_app() -> Router {
    // TODO: Register `GET /protected` and wrap it with `auth_guard`
    Router::new().route("/protected", get(protected_data))
}

fn main() {
    // You can optionally experiment here.
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
