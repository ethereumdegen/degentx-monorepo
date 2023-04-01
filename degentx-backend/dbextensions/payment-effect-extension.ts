
import mongoose, {Mongoose, Schema, Model, model, Require_id, InferSchemaType} from 'mongoose'
  


import {getDatabaseName} from "../lib/app-helper"

const dbName = getDatabaseName()
 


  export const PaymentEffectSchema = new Schema(
    {
      effectType:{type:String,required:true},

      invoiceUUID:{
        type:String, required:true
      },

      productReferenceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required:true 
      },

      targetPublicAddress:{
        type: String,       
        required:true 
      },
     

      status: {type:String, default: 'active'}
        
      
    } 
  ) 
 
mongoose.pluralize(null);

let dbConnection = mongoose.connection.useDb(dbName)

 

//define product access effect
export type IPaymentEffect = Require_id<
InferSchemaType<typeof PaymentEffectSchema>
>
 

export const PaymentEffect = dbConnection.model<IPaymentEffect, Model<IPaymentEffect>>('paymenteffects', PaymentEffectSchema)
 