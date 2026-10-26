# Axum Middlewares & HTTPS

Middlewares intercept incoming HTTP requests before they reach handlers, and outgoing HTTP responses before they are returned to clients.

## Key Concepts

- **`middleware::from_fn`**: The most ergonomic way to write custom middleware in Axum. An async function with signature `async fn my_middleware(req: Request, next: Next) -> Response`.
- **Short-circuiting**: Middlewares can reject a request early (for example, returning `401 Unauthorized` or `403 Forbidden`) without ever calling `next.run(req).await`.
- **Header Modification**: Adding tracing IDs, response timing headers (`x-response-time`), or security headers (`HSTS`, `X-Frame-Options`, `Content-Security-Policy`).
- **Tower `ServiceBuilder`**: Compose multiple standard or custom layers in an organized pipeline (such as timeouts, compression, rate-limiting, and CORS).
- **HTTPS & TLS Security**: Enforcing secure communication through HTTP Strict Transport Security (`HSTS`), preventing clickjacking, and redirecting unencrypted HTTP traffic to HTTPS.

## Further Information

- [Axum Middleware Documentation](https://docs.rs/axum/latest/axum/middleware/index.html)
- [Tower ServiceBuilder Documentation](https://docs.rs/tower/latest/tower/builder/struct.ServiceBuilder.html)
- [OWASP Secure Headers Guide](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
