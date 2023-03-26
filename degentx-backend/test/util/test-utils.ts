import mongoose from "mongoose";


import {getDatabaseConnectURI,getAppName,getEnvironmentName} from '../../lib/app-helper';
 

const APP_NAME = getAppName()

const ENV_MODE = getEnvironmentName() 

const DATABASE_CONNECT_URI = getDatabaseConnectURI()


export async function initTestDatabase(){


  const dbName = APP_NAME.concat('_').concat(ENV_MODE);



  mongoose.set('strictQuery', false);
  await mongoose.connect(DATABASE_CONNECT_URI, {
    dbName ,
    //useCreateIndex: true
  })

  
}



 

export async function disconnectTestDatabase(){

    await mongoose.connection.close()


}