// ws2.rs
//
// In multi-user real-time systems (such as chat rooms or live dashboards),
// messages received on one WebSocket must be broadcast to all other active connections.
//
// `tokio::sync::broadcast` is an asynchronous multi-producer, multi-consumer broadcast channel
// where every receiver sees every message sent.
//
// In this exercise:
// 1. Complete `process_client_message`:
//    - Takes `username: &str`, `msg: Message`, and `tx: &broadcast::Sender<String>`.
//    - If `msg` is `Message::Text(text)`, format as `format!("{}: {}", username, text)`
//      and send to the broadcast channel via `tx.send(formatted)`.
//    - Return `Ok(Some(formatted))` for text messages, or `Ok(None)` for ping/pong/binary.
//
// Execute `rustlings hint ws2` or use the hint tab for guidance.

use axum::extract::ws::Message;
use tokio::sync::broadcast;

pub fn process_client_message(
    username: &str,
    msg: Message,
    tx: &broadcast::Sender<String>,
) -> Result<Option<String>, &'static str> {
    match msg {
        Message::Text(text) => {
            // TODO: Format the message as `<username>: <text>`
            // and broadcast it via `tx.send(...)`.
            // Return `Ok(Some(formatted_string))`
            todo!()
        }
        Message::Ping(_) | Message::Pong(_) | Message::Binary(_) => Ok(None),
        Message::Close(_) => Err("Client disconnected"),
    }
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_broadcast_processing() {
        let (tx, mut rx1) = broadcast::channel(16);
        let mut rx2 = tx.subscribe();

        let msg = Message::Text("Hello everyone!".to_string().into());
        let res = process_client_message("Alice", msg, &tx);

        assert_eq!(res, Ok(Some("Alice: Hello everyone!".to_string())));

        // Both subscribers should receive the broadcast message
        assert_eq!(rx1.try_recv(), Ok("Alice: Hello everyone!".to_string()));
        assert_eq!(rx2.try_recv(), Ok("Alice: Hello everyone!".to_string()));
    }

    #[test]
    fn test_handle_close_frame() {
        let (tx, _rx) = broadcast::channel(16);
        let msg = Message::Close(None);
        let res = process_client_message("Bob", msg, &tx);

        assert_eq!(res, Err("Client disconnected"));
    }
}
