// middleware1.rs solution
use axum::{
    extract::Request,
    http::{HeaderValue, StatusCode},
    middleware::{self, Next},
    response::Response,
    routing::get,
    Router,
};
use tower::ServiceExt;

async fn trace_header_middleware(req: Request, next: Next) -> Response {
    let mut response = next.run(req).await;
    response
        .headers_mut()
        .insert("x-rustal-trace", HeaderValue::from_static("enabled"));
    response
}

async fn hello_handler() -> &'static str {
    "Hello from handler!"
}

pub fn create_app() -> Router {
    Router::new()
        .route("/hello", get(hello_handler))
        .layer(middleware::from_fn(trace_header_middleware))
}

fn main() {
    let _app = create_app();
    println!("Middleware app ready!");
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;

    #[tokio::test]
    async fn test_middleware_attaches_header() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/hello")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let header_val = response.headers().get("x-rustal-trace");
        assert_eq!(
            header_val,
            Some(&HeaderValue::from_static("enabled")),
            "Expected 'x-rustal-trace' header to be 'enabled'"
        );
    }
}
