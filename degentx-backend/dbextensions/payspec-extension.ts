
import {Mongoose, Schema, Model, model, Require_id, InferSchemaType} from 'mongoose'
 
 
 
//import {PayspecInvoice} from 'payspec-js' 
//import ServerSegmentManager from '../segmentmanagers/ServerSegmentManager';
 

 

  export const InvoicePaymentSchema = new Schema(
    {
      
        payspecContractAddress: { type:String, required:true },
        invoiceUUID: {type:String,required:true, unique:true, indexed: true },
      
        paidBy: String,
        transactionHash: String,
        paidAtBlock: Number
    } 
  ) 

  export const PayspecInvoiceSchema = new Schema(
    {
      
        payspecContractAddress: String,
        description : String,
        nonce: String, //BigNumberToString
        token: String,
        totalAmountDue: String,
        
        payToArrayStringified: String,
        amountsDueArrayStringified: String,
        expiresAt: Number,
        invoiceUUID: String 
    } 
  ) 
 


export type IPayspecInvoice = Require_id<
InferSchemaType<typeof PayspecInvoiceSchema>
>
 
export const PayspecInvoice = model<IPayspecInvoice, Model<IPayspecInvoice>>('payspecinvoice', PayspecInvoiceSchema)


export type IInvoicePayment = Require_id<
InferSchemaType<typeof InvoicePaymentSchema>
>
 
export const InvoicePayment = model<IInvoicePayment, Model<IInvoicePayment>>('invoicepayment', InvoicePaymentSchema)


 