
import { ControllerMethod } from "degen-route-loader"   
import { isAssertionSuccess } from "../lib/assertion-helper"
import { sanitizeAndValidateInputs, ValidationType } from "../lib/sanitize-lib"
import { validateAuthToken } from '../lib/auth-helper'
 
import { BigNumber, ethers } from "ethers"

import {validateInvoice} from "payspec-js"
 
import {PayspecInvoice} from "../dbextensions/payspec-extension"
import { PaymentEffect } from "../dbextensions/payment-effect-extension"
import { Product } from "../dbextensions/product-extension"
import { mongoIdToString } from "../lib/mongo-helper"
import { AssertionResult } from "../interfaces/types"
 
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class InvoiceController {
  

  getControllerName() : string {
    return 'invoice'
  }


  getInvoice: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'uuid', type: ValidationType.string,  required: true },
    
    ])

   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const { uuid } = sanitizeResponse.data;

   
   //use lean exec to get a plain object instead of a mongoose document
    const invoice:any = await PayspecInvoice.findOne({invoiceUUID:uuid }).lean().exec();

    if(!invoice){
      return {success:false, error:"Could not find matching invoice"}
    }

    
    const paymentEffects = await PaymentEffect.find({
      invoiceUUID: uuid
    }).lean().exec();

    let productReferenceIds = paymentEffects.map((effect) => effect.productReferenceId)
    let matchingProducts = await Product.find({_id: {$in: productReferenceIds}}).lean().exec();

    let productReferenceLookup = {}
    matchingProducts.forEach((product) => {
      productReferenceLookup[mongoIdToString(product._id)] = product.name
    })
    
    let modifiedPaymentEffects:any[] = paymentEffects.map((effect:any) => {
      
      
      return  Object.assign(effect, {
        productName: productReferenceLookup[ mongoIdToString(effect.productReferenceId ) ]
      })
    
    })

     
 
    let invoiceModified:any = Object.assign(invoice, {paymentEffects: modifiedPaymentEffects})

     
    return {success:true, data: invoiceModified}


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

  getInvoicesByProduct: ControllerMethod = async (req: any) => {
 
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


   /*
    let productOwnerAddress = await getProductOwnerAddress(productId.projectId)
    if( productOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this product"}
    } */


    const paymentEffects = await PaymentEffect.find({
      productReferenceId: productId

    }).lean().exec()

    const invoiceUUIDs = paymentEffects.map((effect) => effect.invoiceUUID)

    //find linkages via payment effects !? 
   
    const invoices = await PayspecInvoice.find({
       invoiceUUID: {$in:invoiceUUIDs}
    })

        

    return {success:true, data : invoices}


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

    if(paymentEffects && Array.isArray(paymentEffects)){

      try{
      let createdResponse = await validateAndCreatePaymentEffects(paymentEffects, invoice.invoiceUUID)


      if(!isAssertionSuccess(createdResponse)){
        return {success:false, error: createdResponse.error}
      }
    }catch(e){
      console.error(e)
      return {success:false, error: "Unable to save payment effects"}
    }

     
    }
      

    /*
      require that the protocol fee is included or else we reject with an error 

    
    */
     
    //should validate the invoice here !! using payspec-js
    /// ... validate the stringified arrays for example 
    const valid = validateInvoice(invoice)
    if(!valid) return {success:false, error:"Invalid invoice"}

    try{
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

     return {success:true, data: result}

    }catch(e){
      return {success:false, error:"Could not create invoice"}
    }

    //should return the uuid !! 



  }


 


}

export async function validateAndCreatePaymentEffects(
  paymentEffects:any, 
  invoiceUUID:string
  ) : Promise<AssertionResult<any>>{

  for(let effect of paymentEffects){
    
    let paymentEffect = new PaymentEffect( {
      invoiceUUID,
      productReferenceId: effect.productReferenceId,
      targetPublicAddress: effect.targetPublicAddress,
      effectType: "product_access_for_account"
    } )

    
    let validationError = paymentEffect.validateSync()


    if(validationError){
      console.error( JSON.stringify(validationError.errors) )
      return {success:false, error: "Could not validate payment effects"}
    }
    

  } 

  for(let effect of paymentEffects){

    let paymentEffect = new PaymentEffect( {
      invoiceUUID,
      productReferenceId: effect.productReferenceId,
      targetPublicAddress: effect.targetPublicAddress,
      effectType: "product_access_for_account"
    } )

    try{
      let saved = await paymentEffect.save()

      if(!saved){
        return {success:false, error:"Could not save payment effects"}
      }
    }catch(e){
      return {success:false, error:"Could not save payment effects"}
    }

  } 

  return {success:true, data:undefined }


}
