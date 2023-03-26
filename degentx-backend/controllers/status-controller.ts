
import { ControllerMethod } from "degen-route-loader"   
import { isAssertionSuccess } from "../lib/assertion-helper"
import { sanitizeAndValidateInputs, ValidationType } from "../lib/sanitize-lib"
 
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class ServerStatusController {
  

  getControllerName() : string {
    return 'status'
  }


  getServerStatus: ControllerMethod = async (req: any) => {
 


    return {success:true}


  }
 
}
