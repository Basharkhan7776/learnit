// middleware3.rs solution
use axum::{
    http::{header::HeaderName, HeaderValue, Request, StatusCode},
    routing::get,
    Router,
};
use tower::ServiceBuilder;
use tower::ServiceExt;
use tower_http::set_header::SetResponseHeaderLayer;

pub fn create_app() -> Router {
    let middleware_stack = ServiceBuilder::new()
        .layer(SetResponseHeaderLayer::overriding(
            HeaderName::from_static("x-server-engine"),
            HeaderValue::from_static("Axum/Tower"),
        ))
        .layer(SetResponseHeaderLayer::overriding(
            HeaderName::from_static("x-content-source"),
            HeaderValue::from_static("Rustal"),
        ));

    Router::new()
        .route("/status", get(|| async { "operational" }))
        .layer(middleware_stack)
}

fn main() {
    let _app = create_app();
    println!("Tower pipeline active!");
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
