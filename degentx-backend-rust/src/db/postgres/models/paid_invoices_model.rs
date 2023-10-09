

use chrono::{DateTime, Utc};
use ethers::{types::{Address, U256, H256, U64}, utils::to_checksum};
use tokio_postgres::Row;
use std::str::FromStr;
use serde::{Serialize, Deserialize };

use crate::{db::postgres::postgres_db::Database, types::chronodatetime::ChronoDateTime};

use super::model::PostgresModelError;
 
#[derive(Serialize)]
pub struct PaidInvoice {
    pub contract_address: Address,

    pub from_address: Address,

    pub total_amount: U256,
    pub invoice_uuid: String,

    pub transaction_hash: Option<H256>,
    pub block_number: Option<U64>,
    pub block_hash: Option<H256>,
    
    pub chain_id: u64,

    pub created_at: Option<ChronoDateTime>,
}

impl PaidInvoice {
    
    pub fn from_row(row:Row) -> Result<Self, PostgresModelError> {
        
        let contract_address = row.get("contract_address");
        let from_address = row.get("from_address");
        
       
          Ok(Self {
            contract_address:  Address::from_str(contract_address)
                        .map_err(|_e| PostgresModelError::AddressParseError)?,
            from_address: Address::from_str(from_address)
                        .map_err(|_e| PostgresModelError::AddressParseError)?,
            total_amount: U256::from_dec_str( &row.get::<_, String>("total_amount") )
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
            chain_id: row.get::<_, i64>("chain_id") as u64,
            block_hash: serde_json::from_str(&row.get::<_, String>("block_hash")).unwrap(),
            created_at:Some(  ChronoDateTime::new(row.get::<_, DateTime<Utc>>("created_at")) ),
        })
         
         
    }
    
}

pub struct PaidInvoicesModel {
    
    
    
}


impl PaidInvoicesModel { 
     
     
     
     pub async fn find_with_invoice_uuid_array ( 
         invoice_uuids: Vec< String>, 
          
         psql_db: &Database
     ) -> Result<  Vec< PaidInvoice >   , PostgresModelError> {
        
           
            let uuids: Vec<String> = invoice_uuids.iter().map(|uuid| 
                
                if uuid.starts_with("0x") {
                    uuid[2..].to_string() // Skips the first 2 characters if starts with "0x"
                } else {
                    uuid.to_string()
                }        
        
          ).collect();
            
            
            
            
           
           let insert_result = psql_db.query("
            SELECT 
                  
            contract_address,
            from_address,
            total_amount,
            invoice_uuid,
            chain_id,
            transaction_hash,
            block_number,
            block_hash,
            created_at
             FROM paid_invoices
             WHERE invoice_uuid = ANY ($1)
             ;
            ", 
            &[&uuids   ]).await ;
            
          
            match insert_result {
           Ok(rows) => {
               
               let mut invoices = Vec::new();
               
               for row in rows {
                       
                   let invoice_from_row = PaidInvoice::from_row(row);
                   
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