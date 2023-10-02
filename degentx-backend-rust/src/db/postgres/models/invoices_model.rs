

use chrono::{DateTime, Utc};
use ethers::{types::{Address, U256, H256, U64}, utils::to_checksum};
use tokio_postgres::Row;
use std::str::FromStr;
   
use crate::db::postgres::postgres_db::Database;

use super::model::PostgresModelError;
 
   
pub struct Invoice {
    pub contract_address: Address,

    pub from_address: Address,

    pub total_amount: U256,
    pub invoice_uuid: Vec<u8>,

    pub transaction_hash: Option<H256>,
    pub block_number: Option<U64>,
    pub block_hash: Option<H256>,

    pub created_at: Option<DateTime<Utc>>,
}

impl Invoice {
    
    pub fn from_row(row:Row) -> Result<Self, PostgresModelError> {
        
        let contract_address = row.get("contract_address");
        let from_address = row.get("from_address");
        
       
          Ok(Self {
            contract_address:  Address::from_str(contract_address)
                        .map_err(|_e| PostgresModelError::AddressParseError)?,
            from_address: Address::from_str(from_address)
                        .map_err(|_e| PostgresModelError::AddressParseError)?,
            total_amount: U256::from_str( &row.get::<_, String>("total_amount") )
                                 .map_err(|_e| PostgresModelError::HexParseError)?,
            invoice_uuid: row.get("invoice_uuid"),
            transaction_hash: serde_json::from_str(
                        &row.get::<_, String>("transaction_hash"),
                    )
                    .map_err(|_e| PostgresModelError::HexParseError)?,
            block_number: Some(
                        u64::from_str(&row.get::<_, String>("block_number"))
                            .unwrap() 
                            .into(),
            ),
            block_hash: serde_json::from_str(&row.get::<_, String>("block_hash")).unwrap(),
            created_at:Some((row.get::<_, DateTime<Utc>>("created_at")).into()),
        })
         
         
    }
    
}

pub struct InvoicesModel {
    
    
    
}


impl InvoicesModel { 
     
     
     
     pub async fn find_with_invoice_uuid_array ( 
         invoice_uuids: Vec<&String>, 
          
         psql_db: &Database
     ) -> Result<  Vec< Invoice >   , PostgresModelError> {
        
           
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
               
               let mut invoices = Vec::new();
               
               for row in rows {
                   
                   let invoice_from_row = Invoice::from_row(row);
                   
                   if let Ok(invoice) = invoice_from_row {
                       invoices.push(invoice);
                   }
                   
               }
               Ok(invoices)
           
           }
           Err(e) => {
               eprintln!("Database error: {:?}", e);
               // You should decide how to handle the error here
               Err(PostgresModelError::Postgres(e)) // Replace with an appropriate error variant
           }
    }
     }
     
    
}