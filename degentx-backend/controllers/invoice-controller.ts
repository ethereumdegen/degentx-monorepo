
import { ControllerMethod } from "degen-route-loader"   
import { isAssertionSuccess } from "../lib/assertion-helper"
import { sanitizeAndValidateInputs, ValidationType } from "../lib/sanitize-lib"
import { validateAuthToken } from '../lib/auth-helper'
 
import { BigNumber, ethers } from "ethers"

import {validateInvoice} from "payspec-js"
 
import {PayspecInvoice} from "../dbextensions/payspec-extension"
import { PaymentEffect } from "../dbextensions/payment-effect-extension"
 
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class InvoiceController {
  

  getControllerName() : string {
    return 'invoice'
  }


  getInvoice: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'uuid', type: ValidationType.string,  required: true },
    //  { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
    //  { key: 'authToken', type: ValidationType.string, required: true },  
    ])

   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const { uuid } = sanitizeResponse.data;

    //check the auth token !! 
 //   let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
 //   if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

   
    const result = await PayspecInvoice.findOne({invoiceUUID:uuid })

    if(!result){
      return {success:false, error:"Could not find matching invoice"}
    }

    /*if(!result || !result.projectId){
      return {success:false, error:"Could not find matching product"}
    }

    let projectOwnerAddress = await getProjectOwnerAddress(result.projectId)
    if( projectOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this product"}
    }*/

    const paymentEffects = await PaymentEffect.find({
      invoiceUUID: uuid
    })

    let invoice = Object.assign(result, {paymentEffects})

    return {success:true, data: invoice}


  }

  //returns all invoices from a particular owner (creator) publicAddress
  getInvoicesByOwner: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
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

   
    const invoices = await PayspecInvoice.find({
      createdBy: publicAddress, 
    })

        

    return {success:true, data : invoices}


  }

 /* getInvoicesByProduct: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'productId', type: ValidationType.string,  required: true },
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ]) 
   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const {publicAddress,authToken,productId} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;


   
    let productOwnerAddress = await getProductOwnerAddress(productId.projectId)
    if( productOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this product"}
    } 



    //find linkages via payment effects !? 
   
    const invoice = await PayspecInvoice.find({
      projectId: projectId, 
    })

        

    return {success:true, data : invoice}


  }*/

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
     
    //should validate the invoice here !! using payspec-js
    /// ... validate the stringified arrays for example 
    const valid = validateInvoice(invoice)
    if(!valid) return {success:false, error:"Invalid invoice"}


    const result = await PayspecInvoice.create({
      payspecContractAddress: invoice.payspecContractAddress,
      description: invoice.description,
      nonce: invoice.nonce,
      token: invoice.token,
      chainId: invoice.chainId,
      payToArrayStringified: invoice.payToArrayStringified,
      amountsDueArrayStringified: invoice.amountsDueArrayStringified,
      expiresAt: invoice.expiresAt,
      invoiceUUID: invoice.invoiceUUID,
      createdBy: publicAddress,
    })

    //should return the uuid !! 

    return {success:true, data: result}


  }


 


}
