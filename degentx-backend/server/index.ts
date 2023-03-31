 
 
  
import mongoose from 'mongoose'


import {getDatabaseConnectURI,getAppName,getEnvironmentName} from '../lib/app-helper';
 
import FileHelper from '../lib/file-helper'
import WebServer from '../lib/web-server'

import APIController from '../controllers/api-controller'
import SessionController from '../controllers/session-controller'
 
import StatusController from '../controllers/status-controller';
import ProjectController from '../controllers/project-controller';
import ProductController from '../controllers/product-controller';
import InvoiceController from '../controllers/invoice-controller';
import PaymentEffectController from '../controllers/payment-effect-controller';

const APP_NAME = getAppName()

const ENV_MODE = getEnvironmentName() 

const DATABASE_CONNECT_URI = getDatabaseConnectURI()



let serverConfigFile = FileHelper.readJSONFile('./config/serverConfig.json')
let serverConfig = serverConfigFile[ENV_MODE]

async function start(){
 
  mongoose.set('strictQuery', false);
  await mongoose.connect(DATABASE_CONNECT_URI, {
    dbName: APP_NAME.concat('_').concat(ENV_MODE),
    //useCreateIndex: true
  })
 
  /*
  Register all api controllers here.
  Each controller class has methods which are defined and bound in routes.json, callable by hitting the uri on the webserver.
  The 'name' field is very important as it must match exactly the 'controller' field of all routes for this controller defined in routes.json
  */
  let apiControllers: Array<APIController>  = [
     new StatusController(),
     new SessionController(),
     
     new ProjectController(),
     new ProductController(),
     new InvoiceController(),
     new PaymentEffectController()
    
  ]

  //@ts-ignore
  let webserver = new WebServer( serverConfig, apiControllers)
  await webserver.start()
  

}


 
start()