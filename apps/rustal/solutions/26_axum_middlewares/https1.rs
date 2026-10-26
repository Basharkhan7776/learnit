// https1.rs solution
use axum::{
    extract::Request,
    http::{HeaderValue, StatusCode},
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use tower::ServiceExt;

async fn enforce_https_and_security_headers(req: Request, next: Next) -> Response {
    let headers = req.headers();

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

    let mut response = next.run(req).await;
    let resp_headers = response.headers_mut();

    resp_headers.insert(
        "strict-transport-security",
        HeaderValue::from_static("max-age=63072000; includeSubDomains; preload"),
    );
    resp_headers.insert(
        "x-content-type-options",
        HeaderValue::from_static("nosniff"),
    );
    resp_headers.insert("x-frame-options", HeaderValue::from_static("DENY"));

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
    let _app = create_app();
    println!("HTTPS guard active!");
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
