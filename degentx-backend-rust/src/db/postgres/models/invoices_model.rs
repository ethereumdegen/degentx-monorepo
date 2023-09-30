

use ethers::{types::Address, utils::to_checksum};

use crate::db::postgres::postgres_db::Database;

use super::model::PostgresModelError;
 
   

pub struct ImagesModel {
    
    
}


impl ImagesModel { 
     
     
     
     pub async fn find_with_invoice_uuid_array ( 
         invoice_uuids: Vec<&String>, 
          
         psql_db: &Database
     ) -> Result<  i32   , PostgresModelError> {
        
           
            let uuids: Vec<String> = invoice_uuids.iter().map(|s| s.to_string()).collect();
    
           
           let insert_result = psql_db.query("
            SELECT 
                  
            contract_address,
            from_address,
            total_amount,
            invoice_uuid,
            
            transaction_hash,
            block_number,
            block_hash,
            created_at
             FROM invoices
             WHERE invoice_uuid = ANY ($1)
             ;
            ", 
            &[&uuids   ]).await ;
            
          
            match insert_result {
           Ok(rows) => {
               if let Some(row) = rows.first() {
                   // This just gets the first column value from the first row, adjust as needed
                   Ok(row.get(0))
               } else {
                   Err(PostgresModelError::RowDidNotExist   ) // Replace with an appropriate error variant
               }
           }
           Err(e) => {
               eprintln!("Database error: {:?}", e);
               // You should decide how to handle the error here
               Err(PostgresModelError::Postgres(e)) // Replace with an appropriate error variant
           }
    }
     }
     
    
}