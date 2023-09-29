



 

use crate::AppState;
 
  
use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};

 use ethers::types::Address;
use serde::{Serialize};
 



use super::web_controller::{WebController  };
  
 //use serde::{Serialize, Deserialize };
//use rocket::serde::{Deserialize };

 

// use serde_json ;
  use actix_web::get;
  use actix_web::web::{self,ServiceConfig, Json, Data};
 
   

pub struct InvoiceController {}

impl InvoiceController { }

 
 


impl WebController for InvoiceController {
    fn config(cfg: &mut ServiceConfig) {
        cfg.service(
            web::scope("/api/invoice")
                // Add your routes here, e.g.,
                .route("", web::get().to(get_invoices))
        );
    }
}

 
 
 
  
#[derive(Serialize)] 
 
pub struct Invoice {}
  
 
  async fn get_invoices(    
   _app_state: Data<AppState>       
        ) -> Option<Json<Vec<Invoice>>> {
    
      let invoices:Vec<Invoice> = Vec::new();
      
      Some(Json( invoices ))
  }
  
   