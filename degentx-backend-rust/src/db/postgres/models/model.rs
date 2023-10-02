
use std::fmt;
use tokio_postgres::Error as PostgresError;
use serde_json::Error as SerdeJsonError;

pub trait Model {} 




#[derive(thiserror::Error, Debug)]
pub enum PostgresModelError {
    #[error(transparent)]
    Postgres(#[from] PostgresError),
    
    #[error(transparent)]
    SerdeJson(#[from] SerdeJsonError),
    
    #[error("The row did not exist in the database.")]
    RowDidNotExist,
    
    #[error("Error converting address from hex")]
    AddressParseError,
    
    #[error("Error converting uint from hex")]
    HexParseError,
}

 
   