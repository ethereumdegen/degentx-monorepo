use serde::Serialize;
use serde::Serializer;
//use chrono::NaiveDateTime;
use chrono::{DateTime, Utc};

pub struct ChronoDateTime (chrono::DateTime<Utc> ); 

impl ChronoDateTime {
    
    pub fn new (time: chrono::DateTime<Utc>) -> Self {
        
        Self(time)
        
    }
    
}

impl Serialize for ChronoDateTime {
    fn serialize<S>(&self,  serializer : S ) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let timestamp = self.0.timestamp();
        serializer.serialize_i64(timestamp)
    }
}
