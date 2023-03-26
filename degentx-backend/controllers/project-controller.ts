
import { ControllerMethod } from "degen-route-loader"   
import { isAssertionSuccess } from "../lib/assertion-helper"
import { sanitizeAndValidateInputs, ValidationType } from "../lib/sanitize-lib"
import { validateAuthToken } from '../lib/auth-helper'
 
import { BigNumber, ethers } from "ethers"
import { Project } from "../dbextensions/project-extension"
import { stringToMongoId } from "../lib/mongo-helper"
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ProjectController {
  

  getControllerName() : string {
    return 'project'
  }


  getProject: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
      { key: 'projectId', type: ValidationType.string,  required: true },
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const {publicAddress, projectId, authToken} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

   
    const results = await Project.findOne({_id: stringToMongoId(projectId), ownerAddress:publicAddress, status: 'active'})

    return {success:true, data : results}


  }


  getProjects: ControllerMethod = async (req: any) => {
 
    const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
          
      { key: 'publicAddress', type: ValidationType.publicaddress,  required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

   
    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

     
    const {publicAddress,authToken} = sanitizeResponse.data;

    //check the auth token !! 
    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

   
    const results = await Project.find({ownerAddress:publicAddress, status: 'active'})

    return {success:true, data : results}


  }

  createProject: ControllerMethod = async (req: any) => {
   
    const sanitizeResponse = sanitizeAndValidateInputs(req.fields , [
      { key: 'name', type: ValidationType.string, required: true } ,   
      { key: 'publicAddress', type: ValidationType.publicaddress, required: true },
      { key: 'authToken', type: ValidationType.string, required: true },  
    ])

    if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

    const {publicAddress, authToken, name} = sanitizeResponse.data;
 

    let authTokenValidationResponse = await validateAuthToken({publicAddress, authToken})
    if(!isAssertionSuccess(authTokenValidationResponse)) return authTokenValidationResponse;

    const randomKey:string = BigNumber.from(ethers.utils.randomBytes(12)).toHexString().slice(2) //secure random 
   

    const result = await Project.create({
      ownerAddress:publicAddress, 
      name 
    })

    return {success:true, data: result}


  }
 
  


}
