//models/requests.rs
use serde::{Deserialize, Serialize};
use crate::models::interfaces::IFrontendUser;

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
}

#[derive(Serialize, Deserialize)]
pub struct BCreateJudge {
    pub name: String,
    pub email: String,
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