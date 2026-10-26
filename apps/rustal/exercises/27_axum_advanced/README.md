# WebSockets & Database Tasks

Modern web applications require bidirectional, real-time communication channels (WebSockets) and robust, persistent data stores (PostgreSQL).

## WebSockets in Axum

- **`WebSocketUpgrade` Extractor**: Handles the HTTP protocol upgrade handshake from HTTP/1.1 to the WebSocket protocol.
- **`on_upgrade`**: Spawns an async task to take ownership of the upgraded full-duplex socket stream (`WebSocket`).
- **Stream Processing**: The socket can be split into a sender (`SplitSink`) and receiver (`SplitStream`).
- **Broadcast Channels**: `tokio::sync::broadcast` allows routing real-time messages across multiple connected client streams.

## Database Integration & PostgreSQL

- **Connection Pools in State**: In high-concurrency Axum servers, connection pools (e.g. `sqlx::PgPool` or `tokio_postgres::Client` / pool) are stored inside Axum `State` to reuse established connections.
- **Parameterized SQL Queries**: Never format user inputs into raw SQL strings! Parameterized placeholders (`$1`, `$2`, etc.) prevent SQL injection.
- **Transactions & Atomic State**: Database modifications often involve multiple steps that must succeed or fail as a single atomic unit. If any step fails (e.g. insufficient balance), rolling back prevents inconsistent data states.
- **In-Memory Testing Pattern**: Testing queries, repository interfaces, and state transformations using self-contained in-memory mock repositories and transaction rollbacks allows fast, deterministic verification without requiring a live PostgreSQL daemon.

## Further Information

- [Axum WebSocket Examples](https://github.com/tokio-rs/axum/blob/main/examples/websockets/src/main.rs)
- [tokio-postgres Documentation](https://docs.rs/tokio-postgres/latest/tokio_postgres/)
- [PostgreSQL Parameterized Queries](https://www.postgresql.org/docs/current/sql-prepare.html)
