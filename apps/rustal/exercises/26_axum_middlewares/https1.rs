// https1.rs
//
// Modern web applications must enforce secure transport (HTTPS) and protection
// against clickjacking and MIME-type sniffing.
//
// In this exercise, write a security middleware `enforce_https_and_security_headers`:
// 1. Check if `x-forwarded-proto` is `"http"`. If so, redirect to HTTPS by returning
//    `StatusCode::MOVED_PERMANENTLY` (301) with the `location` header set to:
//    `format!("https://{}{}", host, uri)`.
// 2. For secure requests, proceed with `next.run(req).await` and append the following headers:
//    - `strict-transport-security`: `"max-age=63072000; includeSubDomains; preload"`
//    - `x-content-type-options`: `"nosniff"`
//    - `x-frame-options`: `"DENY"`
//
// Execute `rustlings hint https1` or use the hint tab for guidance.

use axum::{
    extract::Request,
    http::{HeaderValue, StatusCode},
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use tower::ServiceExt;

// TODO: Implement `enforce_https_and_security_headers`
async fn enforce_https_and_security_headers(req: Request, next: Next) -> Response {
    let headers = req.headers();

    // 1. If "x-forwarded-proto" is "http", redirect to https
    if let Some(proto) = headers.get("x-forwarded-proto") {
        if proto == "http" {
            let host = headers
                .get("host")
                .and_then(|h| h.to_str().ok())
                .unwrap_or("localhost");
            let uri = req.uri().path_and_query().map(|pq| pq.as_str()).unwrap_or("/");
            let target = format!("https://{}{}", host, uri);

            return (
                StatusCode::MOVED_PERMANENTLY,
                [("location", target)],
            )
                .into_response();
        }
    }

    // 2. Call next.run(req).await and attach security headers
    let mut response = next.run(req).await;
    let resp_headers = response.headers_mut();

    // TODO: Insert the three required security headers:
    // - "strict-transport-security": "max-age=63072000; includeSubDomains; preload"
    // - "x-content-type-options": "nosniff"
    // - "x-frame-options": "DENY"

    response
}

async fn index() -> &'static str {
    "Secure Portal"
}

pub fn create_app() -> Router {
    Router::new()
        .route("/", get(index))
        .layer(middleware::from_fn(enforce_https_and_security_headers))
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;

    #[tokio::test]
    async fn test_http_redirect_to_https() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/dashboard?ref=mail")
                    .header("host", "example.com")
                    .header("x-forwarded-proto", "http")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::MOVED_PERMANENTLY);
        assert_eq!(
            response.headers().get("location"),
            Some(&HeaderValue::from_static("https://example.com/dashboard?ref=mail"))
        );
    }

    #[tokio::test]
    async fn test_https_security_headers() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/")
                    .header("host", "example.com")
                    .header("x-forwarded-proto", "https")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(
            response.headers().get("strict-transport-security"),
            Some(&HeaderValue::from_static(
                "max-age=63072000; includeSubDomains; preload"
            ))
        );
        assert_eq!(
            response.headers().get("x-content-type-options"),
            Some(&HeaderValue::from_static("nosniff"))
        );
        assert_eq!(
            response.headers().get("x-frame-options"),
            Some(&HeaderValue::from_static("DENY"))
        );
    }
}
