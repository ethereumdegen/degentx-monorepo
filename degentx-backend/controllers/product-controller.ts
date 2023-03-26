
import { ControllerMethod } from "degen-route-loader"   
import { isAssertionSuccess } from "../lib/assertion-helper"
import { sanitizeAndValidateInputs, ValidationType } from "../lib/sanitize-lib"
import { validateAuthToken } from '../lib/auth-helper'
 
import { BigNumber, ethers } from "ethers"
import { Product } from "../dbextensions/product-extension"

import {getProjectOwnerAddress} from "../modules/project-module"
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ProductController {
  

  getControllerName() : string {
    return 'product'
  }


  getProduct: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'productId', type: ValidationType.string,  required: true },
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const {publicAddress, productId, authToken} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

   
    const result = await Product.findOne({_id:productId, status: 'active'})

    if(!result || !result.projectId){
      return {success:false, error:"Could not find matching product"}
    }

    let projectOwnerAddress = await getProjectOwnerAddress(result.projectId)
    if( projectOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this product"}
    }

    return {success:true, data: result}


  }


  getProducts: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'projectId', type: ValidationType.string,  required: true },
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const {publicAddress,authToken,projectId} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

    let projectOwnerAddress = await getProjectOwnerAddress(projectId)
    if( projectOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this project"}
    }

   
    const results = await Product.find({projectId: projectId, ownerAddress:publicAddress, status: 'active'})

    return {success:true, data : results}


  }

  createProduct: ControllerMethod = async (req: any) => {
   
    const sanitizeResponse = sanitizeAndValidateInputs(req.fields , [  
      { key: 'name', type: ValidationType.string, required: true},
      { key: 'projectId', type: ValidationType.string, required: true},

      { key: 'publicAddress', type: ValidationType.publicaddress, required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

    const {publicAddress, authToken, name, projectId } = sanitizeResponse.data;
 

    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

  
    let projectOwnerAddress = await getProjectOwnerAddress(projectId)
    if( !projectOwnerAddress || projectOwnerAddress != publicAddress ){
      return {success: false, error:"Not the owner of this project"}
    }

    console.log({projectOwnerAddress})
    const result = await Product.create({
      ownerAddress:publicAddress,
      name: name ,
      projectId : projectId
    })

    return {success:true, data: result}


  }
 
  


}