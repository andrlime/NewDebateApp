//models/requests.rs
use serde::{Deserialize, Serialize};
use crate::models::interfaces::{IFrontendUser};
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
    pub paradigm: Option<String>,
    pub notes: Option<String>
}

#[derive(Serialize, Deserialize)]
pub struct BCreateJudge {
    pub name: String,
    pub email: String,
    pub nationality: Option<String>,
    pub gender: Option<String>,
    pub age: Option<String>,
    pub university: Option<String>,
    pub paradigm: Option<String>,
    pub notes: Option<String>
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
pub struct BCreateEvaluation {
    pub id: Option<String>,
    pub tournament_name: Option<String>,
    pub round_name: Option<String>,
    pub is_prelim: Option<bool>,
    pub is_improvement: Option<bool>,
    pub div_name: Option<String>,
    pub decision: Option<f32>,
    pub comparison: Option<f32>,
    pub citation: Option<f32>,
    pub coverage: Option<f32>,
    pub bias: Option<f32>,
    pub weight: Option<i32>,
    pub date: Option<i64>,
}


#[derive(Debug, Deserialize, Serialize)]
pub struct BDeleteEvaluation {
    pub id: String,
    pub timestamp: i64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct BDeleteJudge {
    pub id: String
}

#[derive(Debug, Deserialize, Serialize)]
pub struct BDeleteUser {
    pub email: String
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
