mod routes;
mod models;
mod db;

// use warp::http::StatusCode;
// use serde::{Deserialize, Serialize};
// use std::convert::Infallible;
// use bson::oid::ObjectId;
// use std::str::FromStr;

use warp::Filter;
use std::error::Error;
use tokio;
use std::sync::Arc;
use tokio::sync::Mutex;
use routes::{get_judges, update_judge, create_judge, create_user, validate_user, create_invite_code, get_all_invite_codes};
use log::info;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    std::env::set_var("RUST_LOG", "info");
    env_logger::init();
    let client = Arc::new(Mutex::new(db::init().await?));
    info!("Database connected successfully");

    let client_filter = warp::any().map({
        let client = Arc::clone(&client);
        move || Arc::clone(&client)
    });

    let cors = warp::cors()
        .allow_any_origin() // or .allow_origins(vec!["http://localhost:3000"])
        .allow_methods(vec!["POST", "GET", "PUT", "DELETE", "OPTIONS"]) // methods allowed
        .allow_headers(vec!["Content-Type", "Authorization", "Accept"]); // headers allowed

    let get_judges_route = warp::path("get")
        .and(warp::path("judges"))
        .and(warp::path::end())
        .and(client_filter.clone())
        .and_then(get_judges);

    let get_users_route = warp::path("get")
        .and(warp::path("users"))
        .and(warp::path::end())
        .and(client_filter.clone())
        .and_then(get_all_invite_codes);

    let update_judge_route = warp::path("update")
        .and(warp::path("judge"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(update_judge);

    let create_judge_route = warp::path("create")
        .and(warp::path("judge"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(create_judge);

    let create_user_route = warp::path("auth")
        .and(warp::path("create"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(create_user);

    let validate_user_route = warp::path("auth")
        .and(warp::path("validate"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(validate_user);

    let create_invite_code_route = warp::path("auth")
        .and(warp::path("invite"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(create_invite_code)
        .with(cors.clone());

    let empty_route = warp::path::end()
        .map(|| warp::reply::with_status("OK", warp::http::StatusCode::OK));
    
    let routes = get_judges_route
        .or(create_invite_code_route)
        .or(update_judge_route)
        .or(create_judge_route)
        .or(create_user_route)
        .or(validate_user_route)
        .or(get_users_route)
        .or(empty_route)
        .with(cors);

    warp::serve(routes)
        .run(([0, 0, 0, 0], 3030))
        .await;

    Ok(())
}