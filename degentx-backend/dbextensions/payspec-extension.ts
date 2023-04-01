
import mongoose, {Mongoose, Schema, Model, model, Require_id, InferSchemaType} from 'mongoose'
 
 
 
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
        payspecContractAddress: {type: String, required:true},
        description : {type: String, required:true},
        nonce: {type: String, required:true},  
        token: {type: String, required:true},
        totalAmountDue: {type: String, required:true},
        
        payToArrayStringified: {type: String, required:true},
        amountsDueArrayStringified: {type: String, required:true},
        expiresAt: {type: Number, required:true},
        invoiceUUID: {type: String, required:true, unique:true, index:true } ,

        createdBy: String,
        createdAt: {type: Number, default: Date.now},
        status: {type:String, default:'active'},
    } 
  ) 
 


 
mongoose.pluralize(null);



export type IPayspecInvoice = Require_id<
InferSchemaType<typeof PayspecInvoiceSchema>
>
 
export const PayspecInvoice = model<IPayspecInvoice, Model<IPayspecInvoice>>('payspecinvoices', PayspecInvoiceSchema)


export type IInvoicePayment = Require_id<
InferSchemaType<typeof InvoicePaymentSchema>
>
 
export const InvoicePayment = model<IInvoicePayment, Model<IInvoicePayment>>('invoicepayments', InvoicePaymentSchema)


 