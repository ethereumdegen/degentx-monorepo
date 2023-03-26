import { ethers } from "ethers";
import { Project } from "../dbextensions/project-extension";
 

export async function getProjectOwnerAddress(projectId:string) : Promise<string | undefined >{

    let project = await Project.findOne({_id:projectId})

    if(!project) return undefined 

    return ethers.utils.getAddress(project.ownerAddress)
    

}