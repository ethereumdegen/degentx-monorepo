
import { ControllerMethod } from "degen-route-loader"   
import { isAssertionSuccess } from "../lib/assertion-helper"
import { sanitizeAndValidateInputs, ValidationType } from "../lib/sanitize-lib"
import { validateAuthToken } from '../lib/auth-helper'
 
import { BigNumber, ethers } from "ethers"
 
import {PayspecInvoice} from "../dbextensions/payspec-extension"

import {getProjectOwnerAddress} from "../modules/project-module"
import { PaymentEffect } from "../dbextensions/payment-effect-extension"
import { stringToMongoId } from "../lib/mongo-helper"
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class InvoiceController {
  

  getControllerName() : string {
    return 'invoice'
  }


  getInvoice: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'uuid', type: ValidationType.string,  required: true },
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const {publicAddress, uuid, authToken} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

   
    const result = await PayspecInvoice.findOne({uuid:uuid , status: 'active'})

    /*if(!result || !result.projectId){
      return {success:false, error:"Could not find matching product"}
    }

    let projectOwnerAddress = await getProjectOwnerAddress(result.projectId)
    if( projectOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this product"}
    }*/

    return {success:true, data: result}


  }


  getInvoices: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'productId', type: ValidationType.string,  required: true },
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const {publicAddress,authToken,projectId} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

   /* let projectOwnerAddress = await getProjectOwnerAddress(projectId)
    if( projectOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this project"}
    }*/

   
    const invoice = await PayspecInvoice.find({
      projectId: projectId, 
    })

        

    return {success:true, data : invoice}


  }

  addInvoice: ControllerMethod = async (req: any) => {
   
    const sanitizeResponse = sanitizeAndValidateInputs(req.fields , [  
      { key: 'invoice', type: ValidationType.payspecinvoice, required: true},
      { key: 'paymentEffects' , type: ValidationType.payspecpaymenteffect, shouldBeArray: true, required: false },
       
      { key: 'publicAddress', type: ValidationType.publicaddress, required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

    const { authToken, publicAddress, paymentEffects, invoice } = sanitizeResponse.data;
    

    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;


    //do something w payment effects  -- tie to db and link 


    /*
      require that the protocol fee is included or else we reject with an error 

    
    */

    /*
    let projectOwnerAddress = await getProjectOwnerAddress(projectId)
    if( !projectOwnerAddress || projectOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this project"}
    }*/

  //  console.log({projectOwnerAddress})




    //should validate the invoice here !! using payspec-js ... validate the stringified arrays for example 



    const result = await PayspecInvoice.create({
      payspecContractAddress: invoice.payspecContractAddress,
      description: invoice.description,
      nonce: invoice.nonce,
      token: invoice.token,
      totalAmountDue: invoice.totalAmountDue,
      payToArrayStringified: invoice.payToArrayStringified,
      amountsDueArrayStringified: invoice.amountsDueArrayStringified,
      expiresAt: invoice.expiresAt
    })

    //should return the uuid !! 

    return {success:true, data: result}


  }



  addPaymentEffectToInvoice : ControllerMethod = async (req:any) => {

    const sanitizeResponse = sanitizeAndValidateInputs(req.fields , [  
    
      { key: 'paymentEffect' , type: ValidationType.payspecpaymenteffect,  required: true },
       
      { key: 'publicAddress', type: ValidationType.publicaddress, required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])


    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

    const { authToken, publicAddress, paymentEffect  } = sanitizeResponse.data;
    

    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

    const result = await PaymentEffect.create({

      effectType: paymentEffect.effectType,
      invoiceUUID: paymentEffect.invoiceUUID,
      productReferenceId: stringToMongoId(paymentEffect.productReferenceId),
      targetPublicAddress: paymentEffect.targetPublicAddress,
      
    })


    return {success:false, error:'not implemented'}

  }
 
  


}
