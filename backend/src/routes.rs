use warp::http::StatusCode;
use std::convert::Infallible;
use tokio;
use bson::oid::ObjectId;
use std::sync::Arc;
use tokio::sync::Mutex;
use std::str::FromStr;
use serde::{Deserialize, Serialize};
use mongodb::Client;
use futures::stream::StreamExt;

use crate::models;

#[derive(Serialize, Deserialize)]
pub struct UpdateJudgeBody {
    id: String,
    name: Option<String>,
    email: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct CreateJudgeBody {
    name: String,
    email: String,
}

pub async fn get_judges(client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
  let client = client.lock().await;
  let judges = (*client).database("judges").collection("judges");
  let cursor = judges.find(None, None).await.unwrap();
  let result: Vec<models::Judge> = cursor.filter_map(|doc| async {
      match doc {
          Ok(document) => {
              let judge: Option<models::Judge> = bson::from_bson(bson::Bson::Document(document)).ok();
              judge
          }
          _ => None,
      }
  })
  .collect().await;
  Ok(warp::reply::json(&result))
}

pub async fn update_judge(update: UpdateJudgeBody, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
  let client = client.lock().await;
  let judges = (*client).database("judges").collection::<bson::Document>("judges");
  let id = match ObjectId::from_str(&update.id) {
      Ok(oid) => oid,
      Err(e) => panic!("Error converting string to ObjectId: {}", e),
  };
  let filter = bson::doc! { "_id": id };
  let update = bson::doc! { "$set": { "name": update.name.unwrap_or("".to_string()), "email": update.email.unwrap_or("".to_string()) }};
  judges.find_one_and_update(filter, update, None).await.unwrap();
  Ok(StatusCode::OK)
}

pub async fn create_judge(new_judge: CreateJudgeBody, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
  let client = client.lock().await;
  let judges = (*client).database("judges").collection::<bson::Document>("judges");
  let new_judge = models::Judge {
      _id: ObjectId::new(),
      name: new_judge.name,
      email: new_judge.email,
      evaluations: Vec::new(),
      options: models::Paradigm {
          nationality: String::new(),
          gender: String::new(),
          age: String::new(),
          university: String::new(),
      },
      paradigm: String::new(),
  };
  let new_judge_doc = bson::to_bson(&new_judge).unwrap().as_document().unwrap().clone();
  judges.insert_one(new_judge_doc, None).await.unwrap();
  Ok(StatusCode::OK)
}