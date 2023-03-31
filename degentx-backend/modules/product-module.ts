import { Product } from "../dbextensions/product-extension"
import { stringToMongoId } from "../lib/mongo-helper"
import { getProjectOwnerAddress } from "./project-module"


 

export async function getProductOwnerAddress(productId:string) : Promise<string | undefined >{

    const matchingProduct = await Product.findById(productId)

    if(!matchingProduct || !matchingProduct.projectId){
     return undefined 
    }

  //  if(matchingProduct.status != "active"){
   //    return undefined }

   return getProjectOwnerAddress(matchingProduct.projectId)
    

}

