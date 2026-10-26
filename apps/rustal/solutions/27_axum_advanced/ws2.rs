// ws2.rs solution
use axum::extract::ws::Message;
use tokio::sync::broadcast;

pub fn process_client_message(
    username: &str,
    msg: Message,
    tx: &broadcast::Sender<String>,
) -> Result<Option<String>, &'static str> {
    match msg {
        Message::Text(text) => {
            let formatted = format!("{}: {}", username, text);
            let _ = tx.send(formatted.clone());
            Ok(Some(formatted))
        }
        Message::Ping(_) | Message::Pong(_) | Message::Binary(_) => Ok(None),
        Message::Close(_) => Err("Client disconnected"),
    }
}

fn main() {
    let (tx, _rx) = broadcast::channel(16);
    let msg = Message::Text("Hello".to_string().into());
    let _ = process_client_message("User1", msg, &tx);
    println!("Broadcast processed!");
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
