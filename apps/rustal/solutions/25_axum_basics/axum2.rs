// axum2.rs solution
use axum::{
    extract::Path,
    http::{Request, StatusCode},
    routing::get,
    Router,
};
use http_body_util::BodyExt;
use tower::ServiceExt;

async fn get_user(Path(id): Path<u64>) -> String {
    format!("User profile #{}", id)
}

async fn get_team_member(Path((team, member_id)): Path<(String, u64)>) -> String {
    format!("Team {} member #{}", team, member_id)
}

pub fn create_app() -> Router {
    Router::new()
        .route("/users/{id}", get(get_user))
        .route("/teams/{team}/members/{member_id}", get(get_team_member))
}

fn main() {
    let _app = create_app();
    println!("Routes configured!");
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
