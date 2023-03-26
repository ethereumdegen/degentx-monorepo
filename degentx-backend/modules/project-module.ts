import { ethers } from "ethers";
import { Project } from "../dbextensions/project-extension";
import { stringToMongoId } from "../lib/mongo-helper";
 

export async function getProjectOwnerAddress(projectId:string) : Promise<string | undefined >{

    const projId = stringToMongoId(projectId)
    let project = await Project.findById(projId)

    if(!project) return undefined 

    return ethers.utils.getAddress(project.ownerAddress)
    

}


export async function stubProject({name,ownerAddress}:{name:string,ownerAddress:string}) : Promise< any > {


    let created = await Project.create({
        name,ownerAddress
    })


    return created 

}