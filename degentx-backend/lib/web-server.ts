import fs from 'fs'
import http from 'http'
import https from 'https'
import path from 'path'

import cors from 'cors'
import express from 'express'
import DegenRouteLoader from 'degen-route-loader'

import FileHelper from '../lib/file-helper' 

import {Route} from 'degen-route-loader'

import  history from 'connect-history-api-fallback'
import APIController from '../controllers/session-controller'

 /*

    Uses port 8443 through cloudflare proxy and cf origin certificate 

*/



const PORT = process.env.PORT ? process.env.PORT : 8000 
const SSL_CERT = process.env.SSL_CERT
const SSL_KEY = process.env.SSL_KEY

const HTTPS_ENABLED = !!SSL_CERT && !!SSL_KEY 





const formidable = require('express-formidable')


require('dotenv').config() 
 

const sharedRoutes:Array<Route> = FileHelper.readJSONFile('./config/routes.json')
 


export default class WebServer {
  server: https.Server | http.Server | undefined

  app:any
 

  degenRouteLoader:DegenRouteLoader

  appListener: any

  constructor( public serverConfig: any , public apiControllers: Array<APIController>) {



    this.app = express()

    

    this.degenRouteLoader = new DegenRouteLoader()
 

    let envmode = process.env.NODE_ENV

 

    this.app.use(cors()); 
 
    this.app.use(formidable({}))
  

  }

  async start(  ): Promise<void> {
  

      //Load all of the api controllers similar to rails 
      this.apiControllers.map( controller  => { 
   
        this.degenRouteLoader.registerController( controller.getControllerName(),  controller)
 
      })

     
      let activeRoutes = WebServer.getActiveRoutes(sharedRoutes, this.apiControllers)

    
      this.degenRouteLoader.loadRoutes( this.app, activeRoutes)
      
     
      //host static files from dist for webpage 
      const staticFileMiddleware = express.static('cache');
      this.app.use(staticFileMiddleware);
      this.app.use(history({
        disableDotRule: true,
        verbose: true
      }));
      this.app.use(staticFileMiddleware);


     /* this.appListener = this.app.listen(PORT, () => {
        console.log(`API Server listening on port ${PORT}`)
      })*/


  if(HTTPS_ENABLED){

    // Provide the private and public key to the server by reading each
    // file's content with the readFileSync() method.
      const key = fs.readFileSync(`${SSL_KEY}`)
      const cert = fs.readFileSync(`${SSL_CERT}`)

      this.appListener = https
      .createServer(
        {
          key,
          cert,
        },
        this.app
      )
      .listen(PORT, () => {
        console.log(`Backend Server listening on port ${PORT} using https`)
      });

    }else{
      this.appListener = this.app.listen(PORT);

      console.log(`Backend Server listening on port ${PORT} using http`)
    }






  }



  static getActiveRoutes(defaultRoutes: Route[] , apiControllers: APIController[] ): Route[]{

    let controllerNames = apiControllers.map( controller => controller.getControllerName() )

   
    //load only the shared routes which have names matching the controllers we are loading 
    let filteredSharedRoutes = defaultRoutes.filter( route => (controllerNames.includes(route.controller) ) )
     
     

    return filteredSharedRoutes 
  }


  async stop(    ){
    if(this.appListener){
      this.appListener.close()
    }
    


  }
}
