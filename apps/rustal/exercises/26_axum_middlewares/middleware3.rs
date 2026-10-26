// middleware3.rs
//
// In production applications, middlewares are composed in pipelines using Tower's
// `ServiceBuilder`. This allows combining multiple layers (such as tracing, headers,
// timeouts, and CORS) in a clean, declarative fashion.
//
// In this exercise:
// 1. Build a Tower middleware stack using `tower::ServiceBuilder`:
//    - Add a `SetResponseHeaderLayer` setting `"x-server-engine"` to `"Axum/Tower"`.
//    - Add another layer setting `"x-content-source"` to `"Rustal"`.
// 2. Attach the composed middleware stack to the router using `.layer(middleware_stack)`.
//
// Execute `rustlings hint middleware3` or use the hint tab for guidance.

use axum::{
    http::{header::HeaderName, HeaderValue, Request, StatusCode},
    routing::get,
    Router,
};
use tower::ServiceBuilder;
use tower::ServiceExt;
use tower_http::set_header::SetResponseHeaderLayer;

pub fn create_app() -> Router {
    // TODO: Build the middleware stack using ServiceBuilder
    // let middleware_stack = ServiceBuilder::new()
    //     .layer(SetResponseHeaderLayer::overriding(
    //         HeaderName::from_static("x-server-engine"),
    //         HeaderValue::from_static("Axum/Tower"),
    //     ))
    //     .layer(SetResponseHeaderLayer::overriding(
    //         HeaderName::from_static("x-content-source"),
    //         HeaderValue::from_static("Rustal"),
    //     ));

    Router::new()
        .route("/status", get(|| async { "operational" }))
        // TODO: Apply the middleware stack to the router
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;

    #[tokio::test]
    async fn test_service_builder_layers() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/status")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        let engine = response.headers().get("x-server-engine");
        assert_eq!(engine, Some(&HeaderValue::from_static("Axum/Tower")));

        let source = response.headers().get("x-content-source");
        assert_eq!(source, Some(&HeaderValue::from_static("Rustal")));
    }
}
