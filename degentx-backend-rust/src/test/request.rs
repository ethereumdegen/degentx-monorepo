use reqwest;

use std::collections::HashMap;
use inquire::Select;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    
    loop {
        
            
            let request_type_options = vec!["challenge", "other_option"];
            let selection = Select::new("Which type of request do you want to do?",  request_type_options)          
            .prompt().unwrap() ;
                
            match selection  {
                "challenge" => {
                    // This block handles the "challenge" option
        
                    let result = send_challenge_request().await;
                    
                    if let Err(e) = result {
                        eprintln!("{}",e)
                    }
                }
                
                _ => {
                    // Just in case of unexpected behavior
                    println!("Unexpected selection");
                }
            };
      }
  

  //  Ok(())
}


async fn send_challenge_request() -> Result<(), reqwest::Error> {
    
          
    let client = reqwest::Client::new(); 
    
    
    // Define the payload (based on the structure you want to send)
    let mut map = HashMap::new();
    map.insert("public_address", "0x4283A1B1a622f8117a72B54a83B9cB99DAF74c86");

    // Make the POST request
    let response = client.post("http://localhost:8000/api/session/generate_challenge")
        .json(&map)
        .send()
        .await?;

    // Optionally, print the response (or handle it as needed)
    let response_text = response.text().await?;
    println!("Received: {}", response_text);
    
     Ok(())
}