// middleware1.rs
//
// In Axum, custom middlewares are commonly written using `middleware::from_fn`.
// A middleware function takes an incoming `Request` and a `Next` runner,
// calls `next.run(req).await` to get the response, and can inspect or modify either.
//
// In this exercise:
// 1. Complete the `trace_header_middleware` function:
//    - Call `next.run(req).await` to obtain the response.
//    - Insert the header `"x-rustal-trace"` with value `"enabled"` into `response.headers_mut()`.
//    - Return the modified response.
// 2. Attach the middleware to the router using `.layer(middleware::from_fn(trace_header_middleware))`.
//
// Execute `rustlings hint middleware1` or use the hint tab for guidance.

use axum::{
    extract::Request,
    http::{HeaderValue, StatusCode},
    middleware::{self, Next},
    response::Response,
    routing::get,
    Router,
};
use tower::ServiceExt;

// TODO: Implement `trace_header_middleware`
async fn trace_header_middleware(req: Request, next: Next) -> Response {
    // 1. Call next.run(req).await
    // 2. Add header "x-rustal-trace": "enabled"
    // 3. Return response
    todo!()
}

async fn hello_handler() -> &'static str {
    "Hello from handler!"
}

pub fn create_app() -> Router {
    // TODO: Register `GET /hello` with `hello_handler`, and add `trace_header_middleware` as a layer
    Router::new()
        .route("/hello", get(hello_handler))
}

fn main() {
    // You can optionally experiment here.
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
