
import mongoose, {Mongoose, Schema, Model, model, Require_id, InferSchemaType} from 'mongoose'
 

import {getDatabaseName} from "../lib/app-helper"

const dbName = getDatabaseName()
 

  export const InvoicePaymentSchema = new Schema(
    {
      
        payspecContractAddress: { type:String, required:true },
        invoiceUUID: {type:String,required:true, unique:true, indexed: true },
      
        paidBy: String,
        transactionHash: {type:String,required:true, unique:true },
        chainId: Number,
        paidAtBlock: Number,

        appliedToInvoiceAt: {type:Number}
    } 
  ) 

  export const PayspecInvoiceSchema = new Schema(
    {
        payspecContractAddress: {type: String, required:true},
        description : {type: String, required:true},
        nonce: {type: String, required:true},  
        token: {type: String, required:true},
        chainId: {type: String, required:true},
        
        payToArrayStringified: {type: String, required:true},
        amountsDueArrayStringified: {type: String, required:true},
        expiresAt: {type: Number, required:true},
        invoiceUUID: {type: String, required:true, unique:true, index:true } ,

        createdBy: String,
        createdAt: {type: Number, default: Date.now},
        status: {type:String, default:'active'}, //active or paid 

        paymentTransactionHash:{type:String}, 
        paymentChainId:{type:Number},
        triggeredPaymentEffectsAt: {type:Number}
    } 
  ) 
 


 
mongoose.pluralize(null);

let dbConnection = mongoose.connection.useDb(dbName)



export type IPayspecInvoice = Require_id<
InferSchemaType<typeof PayspecInvoiceSchema>
>
 
export const PayspecInvoice = dbConnection.model<IPayspecInvoice, Model<IPayspecInvoice>>('payspecinvoices', PayspecInvoiceSchema)


export type IInvoicePayment = Require_id<
InferSchemaType<typeof InvoicePaymentSchema>
>
 
export const InvoicePayment = dbConnection.model<IInvoicePayment, Model<IInvoicePayment>>('invoicepayments', InvoicePaymentSchema)


 