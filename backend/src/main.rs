mod routes;
mod db;
mod models;

use warp::Filter;
use std::error::Error;
use tokio;
use std::sync::Arc;
use tokio::sync::Mutex;
use routes::{get_judges, update_judge, create_judge, create_user, validate_user, create_invite_code, get_all_invite_codes, delete_judge, delete_user, create_evaluation, delete_evaluation};
use log::info;
use log::error;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    std::env::set_var("RUST_LOG", "info");
    env_logger::init();

    info!("Connecting to database");
    let client = Arc::new(Mutex::new(db::init().await?));
    info!("Successfully connected to database");

    let client_filter = warp::any().map({
        let client = Arc::clone(&client);
        move || Arc::clone(&client)
    });

    info!("Configuring CORS");

    let cors = warp::cors()
        .allow_any_origin() // or .allow_origins(vec!["http://localhost:3000"])
        .allow_methods(vec!["POST", "GET", "PUT", "DELETE", "OPTIONS"]) // methods allowed
        .allow_headers(vec!["Content-Type", "Authorization", "Accept"]); // headers allowed

    info!("Successfully configured CORS");

    info!("Creating route at /get/judges");

    let get_judges_route = warp::path("get")
        .and(warp::path("judges"))
        .and(warp::path::end())
        .and(client_filter.clone())
        .and_then(get_judges);

    info!("Creating route at /get/users");

    let get_users_route = warp::path("get")
        .and(warp::path("users"))
        .and(warp::path::end())
        .and(client_filter.clone())
        .and_then(get_all_invite_codes);

    info!("Creating route at /delete/judge");

    let delete_judge_route = warp::path("delete")
        .and(warp::path("judge"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(delete_judge);

    info!("Creating route at /delete/user");

    let delete_user_route = warp::path("delete")
        .and(warp::path("user"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(delete_user);

    info!("Creating route at /update/judge");

    let update_judge_route = warp::path("update")
        .and(warp::path("judge"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(update_judge);

    info!("Creating route at /create/judge");

    let create_judge_route = warp::path("create")
        .and(warp::path("judge"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(create_judge);
        
    info!("Creating route at /create/evaluation");

    let create_evaluation_route = warp::path("create")
        .and(warp::path("evaluation"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(create_evaluation);

    info!("Creating route at /delete/evaluation");

    let delete_evaluation_route = warp::path("delete")
        .and(warp::path("evaluation"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(delete_evaluation);

    info!("Creating route at /auth/create");

    let create_user_route = warp::path("auth")
        .and(warp::path("create"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(create_user);

    info!("Creating route at /auth/validate");

    let validate_user_route = warp::path("auth")
        .and(warp::path("validate"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(validate_user);

    info!("Creating route at /auth/invite");

    let create_invite_code_route = warp::path("auth")
        .and(warp::path("invite"))
        .and(warp::path::end())
        .and(warp::body::json())
        .and(client_filter.clone())
        .and_then(create_invite_code)
        .with(cors.clone());

    info!("Creating route at /");

    let empty_route = warp::path::end()
        .map(|| {
            info!("Received request at /");
            warp::reply::with_status("OK", warp::http::StatusCode::OK)
        });
    
    info!("Combining routes");

    let routes = get_judges_route
        .or(create_invite_code_route)
        .or(update_judge_route)
        .or(create_judge_route)
        .or(create_user_route)
        .or(validate_user_route)
        .or(get_users_route)
        .or(delete_judge_route)
        .or(delete_user_route)
        .or(create_evaluation_route)
        .or(delete_evaluation_route)
        .or(empty_route)
        .with(cors);

    info!("Successfully created all routes");

    let port_string = env::var("PORT").unwrap_or_else(|_| String::from("3030"));

    info!("Attempting to set port to {}", port_string);

    let port: u16 = match port_string.parse() {
        Ok(num) => num,
        Err(e) => {
            error!("Failed to parse PORT: {}", e);
            3030
        },
    };

    info!("Successfully set port to {}", port);

    warp::serve(routes)
        .run(([0, 0, 0, 0], port))
        .await;

    Ok(())
}