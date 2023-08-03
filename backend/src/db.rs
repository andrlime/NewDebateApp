use mongodb::Client;
use mongodb::options::ClientOptions;
use mongodb::error::Error;
use dotenv;
use log::error;
use std::process;

pub async fn init() -> Result<Client, Error> {
    dotenv::dotenv().ok();
    let mongodb_uri = std::env::var("URI").unwrap_or_else(|_| {
        error!("MongoDB URI must be set, STOPPING");
        process::exit(1);
    });

    let options = ClientOptions::parse(mongodb_uri).await?;

    let client = Client::with_options(options)?;

    Ok(client)
}
