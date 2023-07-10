use mongodb::Client;
use mongodb::options::ClientOptions;
use mongodb::error::Error;
use dotenv;

pub async fn init() -> Result<Client, Error> {
    dotenv::dotenv().ok();
    let mongodb_uri: String = std::env::var("URI").expect("URI must be set.");

    let options = ClientOptions::parse(mongodb_uri).await?;

    let client = Client::with_options(options)?;

    Ok(client)
}
