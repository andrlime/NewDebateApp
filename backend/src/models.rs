use serde::{Deserialize, Serialize};
use mongodb::bson::DateTime;
use bson::oid::ObjectId;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Evaluation {
    #[serde(rename = "tournamentName")]
    pub tournament_name: String,

    #[serde(rename = "roundName")]
    pub round_name: String,

    #[serde(rename = "isPrelim")]
    pub is_prelim: bool,

    #[serde(rename = "isImprovement")]
    pub is_improvement: bool,
    
    pub decision: f32,
    pub comparison: f32,
    pub citation: f32,
    pub coverage: f32,
    pub bias: f32,
    pub weight: f32,
    pub date: DateTime
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Paradigm {
    pub nationality: String,
    pub gender: String,
    pub age: String,
    pub university: String
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Judge {
    pub _id: ObjectId,
    pub name: String,
    pub email: String,
    pub evaluations: Vec<Evaluation>,
    pub paradigm: String,
    pub options: Paradigm
}

#[derive(Debug, Deserialize, Serialize)]
pub struct User {
    pub _id: ObjectId,
    pub email: String,
    pub name: String,
    pub password: String,  // This should store a hashed version of the password, never plain text
    pub permission_level: i32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct FrontendUser {
    pub email: String,
    pub name: String,
    pub permission_level: i32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InviteCode {
    pub _id: ObjectId,
    pub code: String,
    pub email: String,
    pub permission_level: i32,
    pub name: String
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Login {
    pub email: String,
    pub password: String
}