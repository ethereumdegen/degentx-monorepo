
import mongoose, {Mongoose, Schema, Model, model, Require_id, InferSchemaType} from 'mongoose'
 
 
 
 

  export const ProductSchema = new Schema(
    {
      
        name: { type:String, required:true },

        projectId : {type: String, required: true },
        
      
    } 
  ) 
 
mongoose.pluralize(null);


export type IProduct = Require_id<
InferSchemaType<typeof ProductSchema>
>
 

export const Product = model<IProduct, Model<IProduct>>('products', ProductSchema)
 