
import { ControllerMethod } from "degen-route-loader"   
import { isAssertionSuccess } from "../../lib/assertion-helper"
import { sanitizeAndValidateInputs, unescapeString, ValidationType } from "../../lib/sanitize-lib"
import { validateAuthToken } from '../../lib/auth-helper'
 
import { BigNumber, ethers } from "ethers"
import { IProject, Project } from "../../dbextensions/project-extension"
import { stringToMongoId } from "../../lib/mongo-helper"
 
const MAX_PROJECTS = 10 

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

   
    const result = await Project.findOne({_id: stringToMongoId(projectId), ownerAddress:publicAddress, status: 'active'})

    if(!result){
      return {success:false, error:"No project found"}
    }

    return {success:true, data : renderProject(result) }


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

   
    const projects = await Project.find({ownerAddress:publicAddress, status: 'active'})

    const formattedProjects = projects.map( (project) => renderProject(project) )

    return {success:true, data : formattedProjects}


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

    //const randomKey:string = BigNumber.from(ethers.utils.randomBytes(12)).toHexString().slice(2) //secure random 
   
    const projectCount = await Project.count({ownerAddress:publicAddress})
    if(projectCount >= MAX_PROJECTS) return {success:false, error:"Reached limit for maximum projects"}

    const result = await Project.create({
      ownerAddress:publicAddress, 
      name 
    })

    return {success:true, data: result}


  }


  deleteProject: ControllerMethod = async (req: any) => {
    return {success:false, error:"not implemented"}
  }
 
  



}


export function renderProject(project:IProject) : any{

  return {
    _id: project._id,
    name: unescapeString(project.name),
    ownerAddress: project.ownerAddress,
    status: project.status
  }

}