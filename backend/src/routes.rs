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
use nanoid::nanoid;
use bcrypt::verify;
use jsonwebtoken::{encode, EncodingKey, Header};
use bcrypt::{hash, DEFAULT_COST};
use bson::doc;
use std::time::UNIX_EPOCH;
use std::time::SystemTime;
use std::time::Duration;
use dotenv::dotenv;

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

pub async fn get_all_invite_codes(client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
  let client = client.lock().await;
  let invite_codes = (*client).database("users").collection("invite_codes");
  let cursor = invite_codes.find(None, None).await.unwrap();
  let result: Vec<models::InviteCode> = cursor.filter_map(|doc| async {
      match doc {
          Ok(document) => {
              let invite_code: Option<models::InviteCode> = bson::from_bson(bson::Bson::Document(document)).ok();
              invite_code
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
    Ok(StatusCode::OK,)
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

// Authentication

#[derive(Debug, Deserialize, Serialize)]
pub struct CreateBody {
    pub email: String,
    pub password: String,
    pub code: String,  // Invite code
}

pub async fn create_user(new_user: CreateBody, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    let client = client.lock().await;
    let users = (*client).database("users").collection::<bson::Document>("users");
    let invite_codes = (*client).database("users").collection::<bson::Document>("invite_codes");

    // check if user with the same email already exists
    let user_filter = doc! { "email": &new_user.email };
    let existing_user = users.find_one(user_filter, None).await.unwrap();
    if existing_user.is_some() {
        return Ok(warp::reply::with_status(
            warp::reply::json(&"User with this email already exists."),
            StatusCode::BAD_REQUEST,
        ));
    }

    // Fetch the invite code from the database
    let filter = doc! { "code": &new_user.code };
    let result = invite_codes.find_one(filter, None).await.unwrap();

    if let Some(invite_code_doc) = result {
        let invite_code: models::InviteCode = bson::from_bson(bson::Bson::Document(invite_code_doc)).unwrap();
        
        // Check that the email matches
        if new_user.email != invite_code.email {
            return Ok(warp::reply::with_status(
              warp::reply::json(&"Email incorrect"),
              StatusCode::FORBIDDEN,
            ));
        }

        // Hash the password
        let password_hash = hash(&new_user.password, DEFAULT_COST).unwrap();

        let new_user = models::User {
            _id: ObjectId::new(),
            email: new_user.email,
            name: invite_code.name.clone(),  // Use the name from the invite code
            password: password_hash,
            permission_level: invite_code.permission_level,  // Set the permission level from the invite code
        };

        let new_user_doc = bson::to_bson(&new_user).unwrap().as_document().unwrap().clone();
        users.insert_one(new_user_doc, None).await.unwrap();

        // TODO Add token
        let response = warp::reply::json(&Response {
            user: new_user,
        });

        Ok(response)
    } else {
      Ok(warp::reply::with_status(
        warp::reply::json(&"Invite code incorrect"),
        StatusCode::FORBIDDEN,
      ))
    }
}

// Struct for the token data
#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

#[derive(Serialize, Deserialize)]
pub struct Response {
  token: String,
  user: models::FrontendUser,
}

pub async fn validate_user(login_data: models::Login, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    let client = client.lock().await;
    let users = (*client).database("users").collection::<bson::Document>("users");

    // Find the user in the database
    let filter = doc! { "email": &login_data.email };
    let result = users.find_one(filter, None).await.unwrap();

    if let Some(user_doc) = result {
        let user: models::User = bson::from_bson(bson::Bson::Document(user_doc)).unwrap();

        // Check the password
        if verify(&login_data.password, &user.password).unwrap() {
            // Password is correct, create and send a JWT

            let my_claims = Claims {
                sub: user.email.to_owned(),
                exp: (SystemTime::now() + Duration::from_secs(60*60*24*7)).duration_since(UNIX_EPOCH).unwrap().as_secs() as usize,  // Token valid for 1 week
            };

            dotenv().ok();
            let secret = dotenv::var("SECRET").expect("SECRET must be set");

            let key = EncodingKey::from_secret(secret.as_ref());
            let token = encode(&Header::default(), &my_claims, &key).unwrap();

            let user_info = models::FrontendUser {
              name: user.name,
              email: user.email,
              permission_level: user.permission_level,
            };
            
            let response = warp::reply::json(&Response {
                token: token,
                user: user_info,
            });
            
            return Ok(response)
        } else {
          return Ok(warp::reply::json(&"Incorrect password"))
        }
    }

    // User not found
    return Ok(warp::reply::json(&"User not found"))
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InviteCodeBody {
    email: String,
    name: String,
    permission_level: i32
}

pub async fn create_invite_code(body: InviteCodeBody, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    let client = client.lock().await;
    let invite_codes = (*client).database("users").collection::<bson::Document>("invite_codes");

    // Define a custom alphabet of uppercase letters and digits
    let alphabet: [char; 36] = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z'
    ];

    // Generate a unique invite code
    let code = nanoid!(8, &alphabet);

    let new_invite_code = models::InviteCode {
        _id: ObjectId::new(),
        code: code.clone(),
        email: body.email,
        permission_level: body.permission_level,
        name: body.name
    };

    let new_invite_code_doc = bson::to_bson(&new_invite_code).unwrap().as_document().unwrap().clone();
    invite_codes.insert_one(new_invite_code_doc, None).await.unwrap();
    Ok(warp::reply::json(&code))
}