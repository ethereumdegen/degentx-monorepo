
import { ControllerMethod } from "degen-route-loader"   
import { isAssertionSuccess } from "../lib/assertion-helper"
import { sanitizeAndValidateInputs, ValidationType } from "../lib/sanitize-lib"
import { validateAuthToken } from '../lib/auth-helper'

import {reverseResolveDomain} from '../modules/domain-module'
import { BigNumber, ethers } from "ethers"

import {ApiKey} from '../dbextensions/api-key-extension'

/*
https://docs.alchemy.com/docs/how-to-resolve-ens-domains-given-a-wallet-address
*/


// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class DomainController {
  

  getControllerName() : string {
    return 'apikey'
  }


  getApiKey: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'key', type: ValidationType.string,  required: true },
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const {publicAddress, key, authToken} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

   
    const results = await ApiKey.findOne({key, ownerAddress:publicAddress, status: 'active'})

    return {success:true, data : results}


  }


  getApiKeys: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
          
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const {publicAddress,authToken} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

   
    const results = await ApiKey.find({ownerAddress:publicAddress, status: 'active'})

    return {success:true, data : results}


  }

  createApiKey: ControllerMethod = async (req: any) => {
   
    const sanitizeResponse = sanitizeAndValidateInputs(req.fields , [          
      { key: 'publicAddress', type: ValidationType.publicaddress, required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

    const {publicAddress, authToken} = sanitizeResponse.data;
 

    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

    const randomKey:string = BigNumber.from(ethers.utils.randomBytes(12)).toHexString().slice(2) //secure random 
   

    const result = await ApiKey.create({ownerAddress:publicAddress, key: randomKey})

    return {success:true, data: result}


  }

  deleteApiKey: ControllerMethod = async (req: any) => {

    const sanitizeResponse = sanitizeAndValidateInputs(req.fields , [          
      { key: 'publicAddress', type: ValidationType.publicaddress, required: true },
      { key: 'authToken', type: ValidationType.string, required: true }, 
      { key: 'apikey', type: ValidationType.string, required: true } 
    ])


    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

    const {publicAddress, authToken, apikey} = sanitizeResponse.data;


    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

    let updated = await ApiKey.findOneAndUpdate({ownerAddress:publicAddress, key: apikey}, {status: "deleted"})
    
    return {
      success:true,
      data: undefined 
    }

  }

  


}
