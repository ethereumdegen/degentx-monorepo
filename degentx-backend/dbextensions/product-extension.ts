
import mongoose, {Mongoose, Schema, Model, model, Require_id, InferSchemaType} from 'mongoose'
  

import {getDatabaseName} from "../lib/app-helper"

const dbName = getDatabaseName()


  export const ProductSchema = new Schema(
    {
      
        name: { type:String, required:true },

        projectId : {type: String, required: true },

        status: {type:String, default: 'active'}
        
      
    } 
  ) 
 
 
 
mongoose.pluralize(null);


let dbConnection = mongoose.connection.useDb(dbName)

ProductSchema.index({ name: 1, projectId: 1 }, { unique: true })




//define product 
export type IProduct = Require_id<
InferSchemaType<typeof ProductSchema>
>

export const Product = dbConnection.model<IProduct, Model<IProduct>>('products', ProductSchema)
 
 