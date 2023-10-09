



 

use crate::AppState;
 
  
use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};

 use ethers::types::Address;
use serde::{Serialize};
 

use crate::db::postgres::models::paid_invoices_model::{PaidInvoicesModel, PaidInvoice};

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
            web::scope("/api/paid_invoices")
                // Add your routes here, e.g.,
                .route("", web::post().to(get_invoices))
        );
    }
}
 
  
 
 async fn get_invoices(    
      invoice_uuids: Json< Vec< String > > ,
      app_state: Data<AppState>       
        ) -> Option<Json<Vec<PaidInvoice>>> {
    
      //let invoices:Vec<Invoice> = Vec::new();
     
      
      let uuid_array = invoice_uuids.0; 
      
      let db = &app_state.database;
      
      //fetch from sql 
      let results = PaidInvoicesModel::find_with_invoice_uuid_array(
        uuid_array,
        &db
        
      ).await.unwrap();
      
      
      Some(  Json( results )   )
  }
  
   