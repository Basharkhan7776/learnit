// axum2.rs
//
// In web applications, dynamic path segments allow extracting variables from URLs.
// Axum provides the `Path` extractor for this purpose.
//
// In this exercise:
// 1. Implement `get_user` handler extracting `Path(id): Path<u64>` and returning
//    `format!("User profile #{}", id)`.
// 2. Implement `get_team_member` handler extracting `Path((team, member_id)): Path<(String, u64)>`
//    and returning `format!("Team {} member #{}", team, member_id)`.
// 3. Register both routes in `create_app()`:
//    - "/users/{id}"
//    - "/teams/{team}/members/{member_id}"
//
// Execute `rustlings hint axum2` or use the hint tab for guidance.

use axum::{
    extract::Path,
    http::{Request, StatusCode},
    routing::get,
    Router,
};
use http_body_util::BodyExt;
use tower::ServiceExt;

// TODO: Implement `get_user` taking `Path(id): Path<u64>` and returning String.
async fn get_user(Path(id): Path<u64>) -> String {
    todo!()
}

// TODO: Implement `get_team_member` taking `Path((team, member_id)): Path<(String, u64)>`
async fn get_team_member(Path((team, member_id)): Path<(String, u64)>) -> String {
    todo!()
}

pub fn create_app() -> Router {
    // TODO: Register the routes on Router::new()
    Router::new()
        .route("/users/{id}", get(get_user))
        .route("/teams/{team}/members/{member_id}", get(get_team_member))
}

fn main() {
    // You can optionally experiment here.
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;

    #[tokio::test]
    async fn test_user_path() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/users/42")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        assert_eq!(&body[..], b"User profile #42");
    }

    #[tokio::test]
    async fn test_team_member_path() {
        let app = create_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/teams/rustaceans/members/7")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
        let body = response.into_body().collect().await.unwrap().to_bytes();
        assert_eq!(&body[..], b"Team rustaceans member #7");
    }
}
