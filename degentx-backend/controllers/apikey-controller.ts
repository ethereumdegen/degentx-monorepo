
import { ControllerMethod } from "degen-route-loader"
import { createNewAuthenticatedUserSession, findActiveChallengeForAccount, generateNewRandomBytes, upsertNewChallengeForAccount, validatePersonalSignature } from "../lib/session-lib"
import { sanitizeAndValidateInputs, sanitizeInput, ValidationType } from "../lib/sanitize-lib"
import APIController from "./apikey-controller"
import { isAssertionSuccess } from "../lib/assertion-helper"
import { getAppName } from "../lib/app-helper"
import { validateAuthToken } from "../lib/auth-helper"
import { ApiKey } from "../dbextensions/session-extension"

 const MAX_API_KEYS = 10 
 
export default class ApiKeyController {
    

  getControllerName() : string {
    return 'apikey'
  }



  generateApiKey: ControllerMethod = async (req: any) => {

    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
    
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])


    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse
    
    const {publicAddress, authToken} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;


    let apiKeyCount = await ApiKey.count({publicAddress})
    if(apiKeyCount >= MAX_API_KEYS) return {success:false, error:'Max Api Keys Reached'}
 

    const generatedKey = generateNewRandomBytes();

    let apiKey = ApiKey.create(
      {
        key: generatedKey,
        publicAddress
      }
    )

      return {success:true, data: apiKey}


  }

  deleteApiKey: ControllerMethod = async (req: any) => {

    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'apiKey', type: ValidationType.publicaddress,  required: true },
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])


    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse
    
    const {publicAddress, authToken, apiKey} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

    let deleted = ApiKey.deleteOne({
      publicAddress,
      key: apiKey
    })

    return {success:true, data:deleted}


  }



}
