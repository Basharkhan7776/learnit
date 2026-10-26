// ws1.rs
//
// WebSockets provide bidirectional, persistent full-duplex communication over a single TCP connection.
// In Axum, the `WebSocketUpgrade` extractor inspects the HTTP Upgrade handshake headers
// and upgrades the connection if valid.
//
// In this exercise:
// 1. Implement `ws_handler`:
//    - Takes `ws: WebSocketUpgrade`.
//    - Calls `ws.on_upgrade(handle_socket)` and returns the response.
// 2. Register `GET /ws` with `ws_handler` in `create_app()`.
//
// Execute `rustlings hint ws1` or use the hint tab for guidance.

use axum::{
    extract::ws::{WebSocket, WebSocketUpgrade},
    http::{header, Request, StatusCode},
    response::Response,
    routing::get,
    Router,
};
use tower::ServiceExt;

async fn handle_socket(mut socket: WebSocket) {
    while let Some(Ok(_msg)) = socket.recv().await {
        // Socket communication loop
    }
}

// TODO: Implement `ws_handler` taking `ws: WebSocketUpgrade` and returning `Response`
async fn ws_handler(ws: WebSocketUpgrade) -> Response {
    // ws.on_upgrade(handle_socket)
    todo!()
}

pub fn create_app() -> Router {
    // TODO: Register `GET /ws` with `ws_handler`
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
    async fn test_websocket_upgrade_handshake() {
        let app = create_app();
        let mut req = Request::builder()
            .uri("/ws")
            .header(header::CONNECTION, "upgrade")
            .header(header::UPGRADE, "websocket")
            .header(header::SEC_WEBSOCKET_KEY, "dGhlIHNhbXBsZSBub25jZQ==")
            .header(header::SEC_WEBSOCKET_VERSION, "13")
            .body(Body::empty())
            .unwrap();

        let on_upgrade = hyper::upgrade::on(&mut req);
        req.extensions_mut().insert(on_upgrade);

        let response = app.oneshot(req).await.unwrap();

        assert_eq!(
            response.status(),
            StatusCode::SWITCHING_PROTOCOLS,
            "Expected status 101 Switching Protocols"
        );
        assert!(
            response.headers().contains_key(header::SEC_WEBSOCKET_ACCEPT),
            "Expected Sec-WebSocket-Accept header in response"
        );
    }

    #[tokio::test]
    async fn test_reject_non_upgrade_request() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/ws")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_ne!(
            response.status(),
            StatusCode::SWITCHING_PROTOCOLS,
            "Plain HTTP request must not succeed with protocol switch"
        );
    }
}
