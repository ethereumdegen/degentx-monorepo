
 
 
 
#[macro_use] extern crate log;
    
 pub mod db; 
 mod util; 
 
 mod controllers;
 pub mod test;
 mod types;
  
  

use crate::controllers::web_controller::WebController;
use crate::controllers::invoice_controller::InvoiceController;  
 
 
 use crate::db::postgres::postgres_db::Database;
 
  
 use actix_web::web::Data;
 use actix_web::{App, HttpServer};
use actix_cors::Cors;
use std::io;
 use std::sync::Arc;
  use dotenvy::dotenv;
  
   use std::fs;
   
   
    
 
 // This struct represents state
pub struct AppState {
    database: Arc<Database>,
    
}


#[actix_web::main]
async fn main() -> io::Result<()> {

 dotenv().ok();
 
 // Initialize the logger
    std::env::set_var("RUST_LOG", "actix_web=info,actix_server=info"); // Adjust as per your needs
    env_logger::init();
    
    
   
 
    
 
    //setup and launch the postgres db 
    let database = Arc::new(
        Database::connect().await.unwrap()
    );
  
    
    
    //setup and launch the http server 
    HttpServer::new(move || {
     
          println!("start!!");
          
      let cors = Cors::default()
          
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec!["Authorization", "Accept", "Content-Type"])
            .supports_credentials()
            .max_age(3600);
            
         let app_state = AppState {
            database:  Arc::clone(&database),
            
        };
     
      App::new()
            .app_data(Data::new(  app_state )) // Clone your db connection or use Arc
            .wrap(cors)
            .wrap(actix_web::middleware::Logger::default()) // Enable logger middleware
            .configure(InvoiceController::config)
            
           })
    .bind("0.0.0.0:8000")?
    .run()
    .await

}
 
  