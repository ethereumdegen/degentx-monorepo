
import { ControllerMethod } from "degen-route-loader"   
import { isAssertionSuccess } from "../lib/assertion-helper"
import { sanitizeAndValidateInputs, ValidationType } from "../lib/sanitize-lib"
import { validateAuthToken } from '../lib/auth-helper'

import {forwardResolveDomain,reverseResolveDomain} from '../modules/domain-module'
import {validateApikey} from '../modules/apikey-module'

import {logNewApiRequest} from '../modules/apirequest-module'
/*
https://docs.alchemy.com/docs/how-to-resolve-ens-domains-given-a-wallet-address
*/


// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class DomainController {
  

  getControllerName() : string {
    return 'domain'
  }


  resolveDomains: ControllerMethod = async (req: any) => {


    const sanitizeResponse = sanitizeAndValidateInputs(req.fields , [
          
      { key: 'domains', type: ValidationType.string, shouldBeArray:true, required: true },
      { key: 'apikey', type: ValidationType.string, required: false },  
    ])

    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

    const {domains,apikey} = sanitizeResponse.data;

    let apikeyValidationResponse = await validateApikey( apikey );
    if(!isAssertionSuccess(apikeyValidationResponse)) return apikeyValidationResponse


    const result = await Promise.all(
      domains.map( (domain:string) => forwardResolveDomain({domain}) )
    ) 

    await logNewApiRequest(
      {
        apikey,
        action:'resolve-domains',
        magnitude: domains.length
      }
    )

    return {success:true, data:result}


  }

  reverseResolveDomains: ControllerMethod = async (req: any) => {


    const sanitizeResponse = sanitizeAndValidateInputs(req.fields , [
          
      { key: 'addresses', type: ValidationType.publicaddress, shouldBeArray:true, required: true },
      { key: 'apikey', type: ValidationType.string, required: false },  
    ])

    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

    const {addresses,apikey} = sanitizeResponse.data;

    let apikeyValidationResponse = await validateApikey( apikey );
    if(!isAssertionSuccess(apikeyValidationResponse)) return apikeyValidationResponse


    const result = await Promise.all(
      addresses.map( (address:string) => reverseResolveDomain({address}) )
    ) 

    await logNewApiRequest(
      {
        apikey,
        action:'reverse-resolve-domains',
        magnitude: addresses.length
      }
    )

    return {success:true, data: result}


  }

  


}
