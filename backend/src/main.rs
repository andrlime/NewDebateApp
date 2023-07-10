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
use routes::{get_judges, update_judge, create_judge};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let client = Arc::new(Mutex::new(db::init().await?));
    println!("✅ Database connected successfully");

    let client_filter = warp::any().map({
        let client = Arc::clone(&client);
        move || Arc::clone(&client)
    });

    let get_judges_route = warp::path("get")
        .and(warp::path("judges"))
        .and(warp::path::end())
        .and(client_filter.clone())
        .and_then(get_judges);

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
    
    let routes = get_judges_route
        .or(update_judge_route)
        .or(create_judge_route);
    
    warp::serve(routes)
        .run(([127, 0, 0, 1], 3030))
        .await;

    Ok(())
}