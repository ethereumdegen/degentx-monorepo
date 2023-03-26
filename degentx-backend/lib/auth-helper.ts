import { utils } from "ethers";
import { User, UserSession } from "../dbextensions/user-extension"
import { AssertionResult } from "../interfaces/types";
import { mongoIdToString } from "./mongo-helper";



import { getEnvironmentName } from "./app-helper";


export async function validateAuthToken(  
    { publicAddress , authToken  } :
     { publicAddress:string , authToken:string  } 
      ) : Promise<AssertionResult<any>>{


    if(getEnvironmentName() == 'test'){
      return {success:true, data: undefined}
    }

       

    if(authToken){
 

      let existingUser = await User.findOne({publicAddress: utils.getAddress(publicAddress)})

      if(!existingUser){
        return {success:false, error: "No user with that public address"}
      }

      let userId = mongoIdToString(existingUser._id)

      let existingSession = await UserSession.findOne({sessionToken:authToken})

    
      if(existingSession && existingSession.userId == userId ){
        return {success:true, data:undefined}
      }

      return {success:false, error: "Unable to validate auth token"}

    }



    return {success: false, error: "Unable to validate auth token" }
}