//models/requests.rs
use serde::{Deserialize, Serialize};
use crate::models::interfaces::IFrontendUser;
use bson::oid::ObjectId;

// request body content
#[derive(Debug, Deserialize, Serialize)]
pub struct BLogin {
    pub email: String,
    pub password: String
}

#[derive(Serialize, Deserialize)]
pub struct BUpdateJudge {
    pub id: String,
    pub name: Option<String>,
    pub email: Option<String>,
    pub nationality: Option<String>,
    pub gender: Option<String>,
    pub age: Option<String>,
    pub university: Option<String>,
    pub paradigm: Option<String>
}

#[derive(Serialize, Deserialize)]
pub struct BCreateJudge {
    pub name: String,
    pub email: String,
    pub nationality: Option<String>,
    pub gender: Option<String>,
    pub age: Option<String>,
    pub university: Option<String>,
    pub paradigm: Option<String>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BInviteCode {
    pub email: String,
    pub name: String,
    pub permission_level: i32
}

#[derive(Debug, Deserialize, Serialize)]
pub struct BCreateUser {
    pub email: String,
    pub password: String,
    pub code: String,  // Invite code
}

#[derive(Debug, Deserialize, Serialize)]
pub struct BDeleteJudge {
    pub id: String
}

#[derive(Debug, Deserialize, Serialize)]
pub struct BToken {
    pub token: String, // auth token
}

// custom responses
#[derive(Debug, Serialize, Deserialize)]
pub struct RToken {
    pub sub: String,
    pub exp: usize,
}

#[derive(Serialize, Deserialize)]
pub struct RValidate {
    pub token: String,
    pub user: IFrontendUser,
}

#[derive(Serialize, Deserialize)]
pub struct RNewJudge {
    pub new_id: ObjectId
}

#[derive(Serialize, Deserialize)]
pub struct RMessage {
    pub message: String
}