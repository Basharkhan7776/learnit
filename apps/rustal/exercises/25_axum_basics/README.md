# Axum Core & Routing

[Axum](https://docs.rs/axum/latest/axum/) is an ergonomic and modular web application framework built on top of `tokio`, `tower`, and `hyper`.

## Core Concepts

- **`Router`**: Axum's central component for defining URL routes and associating them with HTTP methods (`get`, `post`, `put`, `delete`).
- **Handlers**: Async functions that take extractors as arguments and return types that implement `IntoResponse`.
- **Extractors**: Types that pull data out of the incoming HTTP request:
  - `Path<T>`: Extracts dynamic parameters from the URL path (e.g., `/users/{id}`).
  - `Query<T>`: Deserializes URL query parameters (e.g., `?page=1&limit=10`).
  - `Json<T>`: Parses JSON request bodies into strongly-typed Rust structs using `serde`.
- **State (`State<T>`)**: Allows sharing application state (like connection pools, caches, or `Arc<Mutex<T>>`) across handlers safely.
- **In-Memory Testing with `oneshot`**: Axum routers implement `tower::Service`. You can test your entire application in-memory by sending `axum::http::Request` to `app.oneshot(req).await` without needing a live network port!

## Further Information

- [Official Axum Documentation](https://docs.rs/axum/latest/axum/)
- [Axum Examples Repository](https://github.com/tokio-rs/axum/tree/main/examples)
- [Tower Service Documentation](https://docs.rs/tower/latest/tower/trait.Service.html)
