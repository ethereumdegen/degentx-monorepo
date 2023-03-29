
import mongoose, {Mongoose, Schema, Model, model, Require_id, InferSchemaType} from 'mongoose'
  



  export const ProductSchema = new Schema(
    {
      
        name: { type:String, required:true },

        projectId : {type: String, required: true },

        status: {type:String, default: 'active'}
        
      
    } 
  ) 
 


  export const ProductAccessEffectSchema = new Schema(
    {
      

      product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required:true 
      },

      userPublicAddress:{
        type: String,       
        required:true 
      },
     

      status: {type:String, default: 'active'}
        
      
    } 
  ) 
 
mongoose.pluralize(null);


ProductSchema.index({ name: 1, projectId: 1 }, { unique: true })




//define product 
export type IProduct = Require_id<
InferSchemaType<typeof ProductSchema>
>

export const Product = model<IProduct, Model<IProduct>>('products', ProductSchema)
 

//define product access effect
export type IProductAccessEffect = Require_id<
InferSchemaType<typeof ProductAccessEffectSchema>
>
 

export const ProductAccessEffect = model<IProductAccessEffect, Model<IProductAccessEffect>>('productaccesseffects', ProductAccessEffectSchema)
 