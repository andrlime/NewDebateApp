use bcrypt::{hash, verify, DEFAULT_COST};
use bson::{doc, oid::ObjectId};
use dotenv::dotenv;
use futures::stream::StreamExt;
use jsonwebtoken::{encode, EncodingKey, Header};
use log::{error, info};
use mongodb::Client;
use nanoid::nanoid;
use std::convert::Infallible;
use std::process;
use std::str::FromStr;
use std::sync::Arc;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tokio;
use tokio::sync::Mutex;
use warp::http::StatusCode;

use crate::models::interfaces::*; 
use crate::models::requests::*;

// /get/judges - route to get all judges
pub async fn get_judges(client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    info!("Received request at /get/judges");
    let client = client.lock().await;
    let judges_collection = (*client).database("judges").collection::<bson::Document>("judges_v2_2_dev");

    let mut cursor = match judges_collection.find(None, None).await {
        Ok(cursor) => cursor,
        Err(e) => {
            error!("{}", e);
            let response = warp::reply::json(&RMessage {
                message: "Could not get all judges".to_string(),
            });
            return Ok(warp::reply::with_status(
                response,
                StatusCode::INTERNAL_SERVER_ERROR,
            ));
        }
    };

    let mut judges: Vec<IJudge> = Vec::new();

    while let Some(result) = cursor.next().await {
        match result {
            Ok(document) => {
                match bson::from_bson::<IJudge>(bson::Bson::Document(document)) {
                    Ok(judge) => judges.push(judge),
                    Err(_) => {
                        error!("Could not deserialize judge");
                    },
                }
            }
            Err(e) => {
                error!("{}", e);
                let response = warp::reply::json(&RMessage {
                    message: "Could not get all judges".to_string()
                });
                return Ok(warp::reply::with_status(
                    response,
                    StatusCode::INTERNAL_SERVER_ERROR,
                ));
            }
        };
    }

    Ok(warp::reply::with_status(
        warp::reply::json(&judges),
        StatusCode::OK,
    ))
}

// /delete/judge - route to delete a judge
pub async fn delete_judge(request: BDeleteJudge, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    info!("Received request at /delete/judge");
    let client = client.lock().await;
    let judges = (*client).database("judges").collection::<IJudge>("judges_v2_2_dev");

    let id = match ObjectId::from_str(&request.id) {
        Ok(oid) => oid,
        Err(e) => panic!("Error converting string to ObjectId: {}", e),
    };
    let filter = bson::doc! { "_id": id };

    // Attempt to delete one document matching the filter.
    // `delete_one` returns a `Result<DeleteResult>`.
    match judges.delete_one(filter, None).await {
        Ok(delete_result) => {
            if delete_result.deleted_count == 0 {
                info!("Judge not found {}", request.id);
                let response = warp::reply::json(&RMessage {
                    message: "Judge not found".to_string()
                });
                Ok(warp::reply::with_status(
                    response,
                    StatusCode::NOT_FOUND,
                ))
            } else {
                info!("Judge deleted {}", request.id);
                let response = warp::reply::json(&RMessage {
                    message: "Deleted successfully".to_string()
                });
                Ok(warp::reply::with_status(
                    response,
                    StatusCode::OK,
                ))
            }
        },
        Err(e) => {
            error!("Failed to delete document: {}", e);
            let response = warp::reply::json(&RMessage {
                message: "Failed to delete document".to_string()
            });

            Ok(warp::reply::with_status(
                response,
                StatusCode::INTERNAL_SERVER_ERROR,
            ))
        },
    }
}

// /delete/user - route to delete a judge
pub async fn delete_user(request: BDeleteUser, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    info!("Received request at /delete/judge");
    let client = client.lock().await;
    let users = (*client).database("users").collection::<bson::Document>("users");
    let invite_codes = (*client).database("users").collection::<bson::Document>("invite_codes");

    let filter = bson::doc! { "email": request.email.clone() };

    // Attempt to delete from the "users" collection
    let delete_result_users = users.delete_one(filter.clone(), None).await;
    match delete_result_users {
        Ok(_result) => {
            info!("Deleted user with email {}", request.email.clone());
        }
        Err(e) => {
            error!("Error occurred while deleting from 'users': {:?}", e);
            let response = warp::reply::json(&RMessage {
                message: "Failed to delete document".to_string()
            });

            return Ok(warp::reply::with_status(
                response,
                StatusCode::INTERNAL_SERVER_ERROR,
            ))
        }
    }

    // Attempt to delete from the "invite_codes" collection
    let delete_result_invite_codes = invite_codes.delete_one(filter.clone(), None).await;
    match delete_result_invite_codes {
        Ok(_result) => {
            info!("Deleted invite code for email {}", request.email.clone());
        }
        Err(e) => {
            error!("Error occurred while deleting from 'invite_codes': {:?}", e);
            let response = warp::reply::json(&RMessage {
                message: "Failed to delete document".to_string()
            });

            return Ok(warp::reply::with_status(
                response,
                StatusCode::INTERNAL_SERVER_ERROR,
            ))
        }
    }

    let response = warp::reply::json(&RMessage {
        message: "Successfully deleted user".to_string()
    });

    Ok(warp::reply::with_status(
        response,
        StatusCode::OK,
    ))
}

// /get/users - route to get all users with invite code
pub async fn get_all_invite_codes(client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    info!("Received request at /get/users");
    let client = client.lock().await;
    let invite_codes = (*client).database("users").collection("invite_codes");

    let cursor = invite_codes.find(None, None).await.unwrap();
    let result: Vec<IInviteCode> = cursor.filter_map(|doc| async {
        match doc {
            Ok(document) => {
                let invite_code: Option<IInviteCode> = bson::from_bson(bson::Bson::Document(document)).ok();
                invite_code
            }
            _ => None,
        }
    })
    .collect().await;

    Ok(warp::reply::json(&result))
}

// /update/judge - route to update judge metadata
pub async fn update_judge(update: BUpdateJudge, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    info!("Received request at /update/judge");
    let client = client.lock().await;
    let judges = (*client).database("judges").collection::<bson::Document>("judges_v2_2_dev");

    let id = match ObjectId::from_str(&update.id) {
        Ok(oid) => oid,
        Err(e) => panic!("Error converting string to ObjectId: {}", e),
    };

    let filter = bson::doc! { "_id": id };
    let update = bson::doc! { "$set": { 
        "name": update.name.unwrap_or("".to_string()), 
        "email": update.email.unwrap_or("".to_string()),
        "options": {
            "nationality": update.nationality.unwrap_or("".to_string()),
            "gender": update.gender.unwrap_or("".to_string()),
            "age": update.age.unwrap_or("".to_string()),
            "university": update.university.unwrap_or("".to_string()),
        },
        "paradigm": update.paradigm.unwrap_or("".to_string())
    }};
    judges.find_one_and_update(filter, update, None).await.unwrap();
    
    Ok(StatusCode::OK,)
}

// /create/evaluation - route to update judge metadata
pub async fn create_evaluation(update: BCreateEvaluation, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    info!("Received request at /create/evaluation");
    let client = client.lock().await;
    let judges = (*client).database("judges").collection::<bson::Document>("judges_v2_2_dev");

    let id = match ObjectId::from_str(&update.id.unwrap_or("".to_string())) {
        Ok(oid) => oid,
        Err(e) => panic!("Error converting string to ObjectId: {}", e),
    };

    let filter = bson::doc! { "_id": id };
    
    let evaluation = bson::doc! {
        "tournament_name": update.tournament_name,
        "round_name": update.round_name,
        "is_prelim": false,
        "is_improvement": update.is_improvement,
        "div_name": update.div_name,
        "decision": update.decision,
        "comparison": update.comparison,
        "citation": update.citation,
        "coverage": update.coverage,
        "bias": update.bias,
        "weight": update.weight,
        "date": bson::DateTime::from_millis(update.date.unwrap_or(0).into())
    };

    let update = bson::doc! { "$push": { 
        "evaluations": evaluation
    }};

    judges.find_one_and_update(filter, update, None).await.unwrap();
    
    let response = warp::reply::json(&RMessage {
        message: "Okay".to_string()
    });

    Ok(warp::reply::with_status(
        response,
        StatusCode::OK,
    ))
}

// /delete/evaluation - delete an eval
pub async fn delete_evaluation(update: BDeleteEvaluation, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    info!("Received request at /delete/evaluation");
    let client = client.lock().await;
    let judges = (*client).database("judges").collection::<bson::Document>("judges_v2_2_dev");

    let id = match ObjectId::from_str(&update.id) {
        Ok(oid) => oid,
        Err(e) => panic!("Error converting string to ObjectId: {}", e),
    };

    // Convert the timestamp in milliseconds to a Date
    let bson_datetime = bson::DateTime::from_millis(update.timestamp.into());
    let delete_evaluation = bson::doc! { "date": bson_datetime };

    let filter = bson::doc! { "_id": id };
    let update = bson::doc! { "$pull": { 
        "evaluations": delete_evaluation
    }};

    judges.find_one_and_update(filter, update, None).await.unwrap();
    
    Ok(StatusCode::OK,)
}

// /create/judge - route to create a new judge
pub async fn create_judge(new_judge: BCreateJudge, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    info!("Received request at /create/judge");
    let client = client.lock().await;
    let judges = (*client).database("judges").collection::<bson::Document>("judges_v2_2_dev");
    let new_id = ObjectId::new();
    let new_judge = IJudge {
        _id: new_id,
        name: new_judge.name,
        email: new_judge.email,
        evaluations: Vec::new(),
        options: IParadigm {
            nationality: new_judge.nationality.unwrap_or("".to_string()),
            gender: new_judge.gender.unwrap_or("".to_string()),
            age: new_judge.age.unwrap_or("".to_string()),
            university: new_judge.university.unwrap_or("".to_string())
        },
        paradigm: Some(new_judge.paradigm.unwrap_or("".to_string())),
    };
    
    let new_judge_doc = bson::to_bson(&new_judge).unwrap().as_document().unwrap().clone();
    judges.insert_one(new_judge_doc, None).await.unwrap();
    
    let response = warp::reply::json(&RNewJudge {
        new_id: new_id,
    });

    Ok(warp::reply::with_status(
        response,
        StatusCode::OK,
    ))
}

// /auth/create - create a new user via checking the invite code
pub async fn create_user(new_user: BCreateUser, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    info!("Received request at /auth/create");
    let client = client.lock().await;
    let users = (*client).database("users").collection::<bson::Document>("users");
    let invite_codes = (*client).database("users").collection::<bson::Document>("invite_codes");

    // Check if user with the same email already exists
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
        let invite_code: IInviteCode = bson::from_bson(bson::Bson::Document(invite_code_doc)).unwrap();
        
        // Check that the email matches
        if new_user.email != invite_code.email {
            return Ok(warp::reply::with_status(
              warp::reply::json(&"Email incorrect"),
              StatusCode::FORBIDDEN,
            ));
        }

        // Hash the password
        let password_hash = hash(&new_user.password, DEFAULT_COST).unwrap();

        let new_user_to_make = IUser {
            _id: ObjectId::new(),
            email: new_user.email,
            name: invite_code.name.clone(),  // Use the name from the invite code
            password: password_hash,
            permission_level: invite_code.permission_level,  // Set the permission level from the invite code
        };

        let new_user_doc = bson::to_bson(&new_user_to_make).unwrap().as_document().unwrap().clone();
        users.insert_one(new_user_doc, None).await.unwrap();

        let user_info = IFrontendUser {
            name: new_user_to_make.name,
            email: new_user_to_make.email,
            permission_level: new_user_to_make.permission_level,
        };

        let token_response = RToken {
            sub: user_info.email.to_owned(),
            exp: (SystemTime::now() + Duration::from_secs(60*60*24*7)).duration_since(UNIX_EPOCH).unwrap().as_secs() as usize,  // Token valid for 1 week
        };

        dotenv().ok();
        let secret = dotenv::var("SECRET").unwrap_or_else(|_| {
            error!("Tokenizing SECRET must be set, STOPPING");
            process::exit(1);
        });

        let key = EncodingKey::from_secret(secret.as_ref());
        let user_token = encode(&Header::default(), &token_response, &key).unwrap();

        let response = warp::reply::json(&RValidate {
            token: user_token,
            user: user_info,
        });

        Ok(warp::reply::with_status(
            response,
            StatusCode::OK,
        ))
    } else {
      Ok(warp::reply::with_status(
        warp::reply::json(&"Invite code incorrect"),
        StatusCode::FORBIDDEN,
      ))
    }
}

// /auth/validate - login route, check if user is valid
pub async fn validate_user(login_data: BLogin, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    info!("Received request at /auth/validate");
    let client = client.lock().await;
    let users = (*client).database("users").collection::<bson::Document>("users");

    // Find the user in the database
    let filter = doc! { "email": &login_data.email };
    let result = users.find_one(filter, None).await.unwrap();

    if let Some(user_doc) = result {
        let user: IUser = bson::from_bson(bson::Bson::Document(user_doc)).unwrap();

        // Check the password
        if verify(&login_data.password, &user.password).unwrap() {
            // Password is correct, create and send a JWT

            let token_response = RToken {
                sub: user.email.to_owned(),
                exp: (SystemTime::now() + Duration::from_secs(60*60*24*7)).duration_since(UNIX_EPOCH).unwrap().as_secs() as usize,  // Token valid for 1 week
            };

            dotenv().ok();
            let secret = dotenv::var("SECRET").unwrap_or_else(|_| {
                error!("Tokenizing SECRET must be set, STOPPING");
                process::exit(1);
            });

            let key = EncodingKey::from_secret(secret.as_ref());
            let token = encode(&Header::default(), &token_response, &key).unwrap();

            let user_info = IFrontendUser {
              name: user.name,
              email: user.email,
              permission_level: user.permission_level,
            };
            
            let response = warp::reply::json(&RValidate {
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

// /auth/invite - create a new user invite code
pub async fn create_invite_code(body: BInviteCode, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
    info!("Received request at /auth/invite");
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

    let new_invite_code = IInviteCode {
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

// // /auth/token - checks if a token is valid and returns a status code
// pub async fn check_auth_token(body: BToken, client: Arc<Mutex<Client>>) -> Result<impl warp::Reply, Infallible> {
//     info!("Received request at /auth/token");
//     let client = client.lock().await;

//     // get the secret key from env variables

//     // destructure the token

//     // check if the token is valid - in terms of time

//     // if valid, return ok

//     // if not valid, return not ok - signals frontend to log out / deny access

// }


// manip evaluations
/*
#[derive(Debug, Deserialize, Serialize)]
pub struct BCreateEvaluation {
    pub eval: IEvaluation,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct BDeleteEvaluation {
    pub timestamp: String,
}

*/