
import mongoose, {Mongoose, Schema, Model, model, Require_id, InferSchemaType} from 'mongoose'
  

 


  export const PaymentEffectSchema = new Schema(
    {
      effectType:{type:String,required:true},

      invoiceUUID:{
        type:String, required:true
      },

      productReference:{
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

 

//define product access effect
export type IPaymentEffect = Require_id<
InferSchemaType<typeof PaymentEffectSchema>
>
 

export const PaymentEffect = model<IPaymentEffect, Model<IPaymentEffect>>('paymenteffects', PaymentEffectSchema)
 