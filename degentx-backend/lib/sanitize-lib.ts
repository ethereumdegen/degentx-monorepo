import { BigNumber, ethers } from "ethers"
import { AssertionResult } from "../interfaces/types"
 


export enum ValidationType {
    number = 'number',
    float = 'float',
    bignumber = 'bignumber',
    date = 'date',
    string = 'string',
    text = 'text',
    email = 'email',
    phone = 'phone',
    boolean = 'boolean',
    publicaddress = 'publicaddress',
    pagination = 'pagination',
    payspecinvoice = 'payspecinvoice',
    payspecpaymenteffect = 'payspecpaymenteffect'
     
  }


  export interface ValidationSpecification {
    key: string
    type: ValidationType
    shouldBeArray?: boolean
    required: boolean
  }

  export function sanitizeAndValidateInputs<T>(
    fields: T,
    specifications: ValidationSpecification[]
  ): AssertionResult<T> {
    for (const spec of specifications) {
      //@ts-ignore
      if (typeof fields[spec.key] == 'undefined' && spec.required)
        return { success: false, error: `Missing ${spec.key}` }
    }
  
    return sanitizeInputs(fields, specifications)
  }
  
  function sanitizeInputs(
    fields: any,
    specifications: ValidationSpecification[]
  ): AssertionResult<any> {
    const data: Record<string | number | symbol, any> = {}
  
    for (const spec of specifications) {
      // if (typeof spec.type == 'undefined') throw new Error('Specification type undefined')
  
      const output = sanitizeInput(
        fields[spec.key],
        spec.type,
        spec.shouldBeArray
      )
  
      if (typeof output != undefined) {
        data[spec.key] = output
      }
    }
  
    return { success: true, data }
  }
  
  export function sanitizeInput(
    input: any,
    type: ValidationType,
    shouldBeArray?: boolean
  ): any {
    if (typeof input == 'undefined') {
      return undefined
    }
  
    if (shouldBeArray) {

     
     if (Array.isArray(input)) {
      
        return input.map((x) => sanitizeInput(x, type))
      } else { 
        if (type == ValidationType.string) {  
          const elements = input.toString().split(',')
          return elements.map((x: string) => sanitizeInput(x, type))
        }
  
        return [sanitizeInput(input, type)]
      } 
    }
  
    if (type == ValidationType.number) {
      const result = parseInt(input)
      if (isNaN(result)) {
        return 0
      }
  
      return result
    }
  
    if (type == ValidationType.float) {
      const result = parseFloat(input)
      if (isNaN(result)) {
        return 0
      }
  
      return result
    }
  
    if (type == ValidationType.bignumber) {
      const result = BigNumber.from(input)
  
      return result
    }
  
    if (type == ValidationType.date) {
      //   let result = Date.parse(input)
      const seconds = new Date(input).getTime() / 1000
  
      return seconds
    }
  
    if (type == ValidationType.string) {
      return escapeString(input)
    }
  
    if (type == ValidationType.text) {
      return escapeString(input)
    }
  
    if (type == ValidationType.email) {
      if (!input.includes('@')) {
        throw new Error(`Invalid email address`)
      }
  
      return escapeString(input)
    }
  
    if (type == ValidationType.phone) {
      return escapeString(input)
    }

    if (type == ValidationType.payspecinvoice) {
      return {

        payspecContractAddress: sanitizeInput(input.payspecContractAddress, ValidationType.publicaddress),
        description: sanitizeInput(input.description, ValidationType.string),
        nonce: sanitizeInput(input.nonce, ValidationType.string),
        token: sanitizeInput(input.token, ValidationType.publicaddress),
        tokenAmountDue: sanitizeInput(input.tokenAmountDue, ValidationType.string),
        payToArrayStringified:  sanitizeInput(input.payToArrayStringified, ValidationType.string),
        amountsDueArrayStringified:  sanitizeInput(input.amountsDueArrayStringified, ValidationType.string),
        expiresAt: sanitizeInput(input.expiresAt, ValidationType.string ),
        invoiceUUID: sanitizeInput(input.invoiceUUID, ValidationType.string)

      }  
    }

    if (type == ValidationType.payspecpaymenteffect) {
      return {

        type: sanitizeInput(input.type, ValidationType.string),
        invoiceUUID: sanitizeInput(input.invoiceUUID, ValidationType.string),
        referenceId: sanitizeInput(input.referenceId, ValidationType.string),
        targetPublicAddress: sanitizeInput(input.targetPublicAddress, ValidationType.publicaddress)

      }  
    }
  
    if (type == ValidationType.boolean) {
      return input === 'true'
    }
  
    if (type == ValidationType.publicaddress) {
      try {
        return toChecksumAddress(input)
      } catch (error) {
        return undefined
      }
    }
    
   
   
  
    throw new Error(`Unable to sanitize input of type ${type}`)
  }
  


export function  escapeString(input: string) : string {

    return encodeURI(input)
}

export function  unescapeString(input: string) : string {
    
    return decodeURI(input)
}

export function  toChecksumAddress( address:string  ){

    return ethers.utils.getAddress(address) 
}

export async function getMaxValue( model:any, attributeName:string ){

    let query:any = {} 
    query[attributeName] = -1 

    let record = await model.findOne({}).sort(query) 
    
    if(record){
        return record[attributeName]
    }

    return 0 ;
}