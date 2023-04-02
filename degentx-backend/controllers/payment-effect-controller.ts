
import { ControllerMethod } from "degen-route-loader"   
import { isAssertionSuccess } from "../lib/assertion-helper"
import { sanitizeAndValidateInputs, ValidationType } from "../lib/sanitize-lib"
import { validateAuthToken } from '../lib/auth-helper'
 
import { BigNumber, ethers } from "ethers"
 
import {PayspecInvoice} from "../dbextensions/payspec-extension"

import {getProjectOwnerAddress} from "../modules/project-module"
import { PaymentEffect } from "../dbextensions/payment-effect-extension"
import { stringToMongoId } from "../lib/mongo-helper"
import { Product } from "../dbextensions/product-extension"
import { getProductOwnerAddress } from "../modules/product-module"
 
export enum ValidEffectTypes  {

  PRODUCT_ACCESS="product_access_for_account"



}


// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class PaymentEffectController {
  
 


  getControllerName() : string {
    return 'paymenteffect'
  }


  getPaymentEffect: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'paymentEffectId', type: ValidationType.string,  required: true },
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const {paymentEffectId, publicAddress,  authToken} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

   
    const result = await PaymentEffect.findById(paymentEffectId)

    /*if(!result || !result.projectId){
      return {success:false, error:"Could not find matching product"}
    }

    let projectOwnerAddress = await getProjectOwnerAddress(result.projectId)
    if( projectOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this product"}
    }*/

    return {success:true, data: result}


  }

  
  getPaymentEffectsByInvoice: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'invoiceUUID', type: ValidationType.string,  required: true },
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ]) 
   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const {publicAddress,authToken,invoiceUUID} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

   /* let projectOwnerAddress = await getProjectOwnerAddress(projectId)
    if( projectOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this project"}
    }*/

   
    const effects = await PaymentEffect.find({
      invoiceUUID 
    })

        

    return {success:true, data : effects}


  }
 
  addPaymentEffect: ControllerMethod = async (req: any) => {
   
    const sanitizeResponse = sanitizeAndValidateInputs(req.fields , [  
      
      { key: 'paymentEffect' , type: ValidationType.payspecpaymenteffect,  required: false },
       
      { key: 'publicAddress', type: ValidationType.publicaddress, required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

    const { authToken, publicAddress, paymentEffect } = sanitizeResponse.data;
    

    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;


    //do something w payment effects  -- tie to db and link 


    /*
      require that the protocol fee is included or else we reject with an error 

    
    */
    
      //make sure the invoice with that UUID exists and is active ? 
      //also make sure that the product is owned by this 


    let productId = paymentEffect.productReferenceId;

   
    let productOwnerAddress = await getProductOwnerAddress(productId)
    if( productOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this product"}
    } 

 

    const result = await PaymentEffect.create({
      effectType: paymentEffect.effectType,
      invoiceUUID: paymentEffect.invoiceUUID,
      productReferenceId: stringToMongoId(paymentEffect.productReferenceId),
      targetPublicAddress: paymentEffect.targetPublicAddress,

    })

   

    return {success:true, data: result}


  }


 
  


}
