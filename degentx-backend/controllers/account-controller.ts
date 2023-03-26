
import { ControllerMethod } from "degen-route-loader"   
import { isAssertionSuccess } from '../lib/assertion-helper'
import { sanitizeAndValidateInputs, ValidationType } from "../lib/sanitize-lib"
import { validateAuthToken } from '../lib/auth-helper'
import { fetchTransactionCount } from '../lib/alchemy-lib'

export default class AccountController {

     

    getControllerName() : string {
        return 'account'
    }



    getAccount: ControllerMethod = async (req: any) => {
       
        const sanitizeResponse = sanitizeAndValidateInputs(req.query , [
          
            { key: 'publicAddress', type: ValidationType.publicaddress, required: true },
            { key: 'authToken', type: ValidationType.string, required: true },  
          ])

        if(!isAssertionSuccess(sanitizeResponse)) return sanitizeResponse

        const {publicAddress, authToken} = sanitizeResponse.data 

        const authTokenValidated = await validateAuthToken( { publicAddress , authToken  }  )
        if(!isAssertionSuccess(authTokenValidated)) return {success: false, error: 'not authenticated'}

        console.log({publicAddress})
        //make sure public address is a valid address 

        //the authtoken should be an input too !!

       
        //get transaction count 

        const transactionCountResponse = await fetchTransactionCount({publicAddress})

        //should be mirrored to alchemy api 

        if(!isAssertionSuccess(transactionCountResponse)){
            return transactionCountResponse
        }

        const transactionCount = transactionCountResponse.data 
   

        return   {success:true, data:{ transactionCount } }
    }

    

}