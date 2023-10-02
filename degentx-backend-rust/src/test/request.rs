use reqwest;

use std::collections::HashMap;
use inquire::Select;




     /*
     
     2e3d8c3b6af1043e6e5391ebef96f8afb9e3fe50706d02ee04d5eeab31cd342e
     
     */
     
     
#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    
    loop {
        
            
            let request_type_options = vec!["get_invoice", "other_option"];
            let selection = Select::new("Which type of request do you want to do?",  request_type_options)          
            .prompt().unwrap() ;
                
            match selection  {
                "get_invoice" => {
                    // This block handles the "challenge" option
        
                    let result = send_get_invoice_request().await;
                    
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


async fn send_get_invoice_request() -> Result<(), reqwest::Error> {
    
          
    let client = reqwest::Client::new(); 
    
    
    let invoice_uuid = "2e3d8c3b6af1043e6e5391ebef96f8afb9e3fe50706d02ee04d5eeab31cd342e";
    
    
    // Define the payload (based on the structure you want to send)
    let mut map = HashMap::new();
    map.insert("invoice_uuid", invoice_uuid);

    // Make the POST request
    let response = client.post("http://localhost:8000/api/invoices")
        .json(&map)
        .send()
        .await?;

    // Optionally, print the response (or handle it as needed)
    let response_text = response.text().await?;
    println!("Received: {}", response_text);
    
     Ok(())
}