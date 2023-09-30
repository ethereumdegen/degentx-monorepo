
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
}


/*

// Implement the standard Error trait
impl std::error::Error for PostgresModelError {}

// Implement Display for MyPostgresError
impl fmt::Display for PostgresModelError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match *self {
            PostgresModelError::Postgres(ref err) => write!(f, "PostgresError: {}", err),
            PostgresModelError::SerdeJson(ref err) => write!(f, "SerdeJsonError: {}", err),
            RowDidNotExist
        }
    }
}

// Implement From trait for tokio_postgres::Error
impl From<PostgresError> for PostgresModelError {
    fn from(error: PostgresError) -> Self {
        PostgresModelError::Postgres(error)
    }
}

// Implement From trait for serde_json::Error
impl From<SerdeJsonError> for PostgresModelError {
    fn from(error: SerdeJsonError) -> Self {
        PostgresModelError::SerdeJson(error)
    }
}
 */