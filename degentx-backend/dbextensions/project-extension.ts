
import mongoose, {Mongoose, Schema, Model, model, Require_id, InferSchemaType} from 'mongoose'
 
 
 

import {getDatabaseName} from "../lib/app-helper"

const dbName = getDatabaseName()

  export const ProjectSchema = new Schema(
    {
      
        name: { type:String, required:true,  indexed: true  },
        ownerAddress: {type:String,required:true,  indexed: true },
        status:{type:String, default:'active'}
      
      
    } 
  ) 
 
mongoose.pluralize(null);


let dbConnection = mongoose.connection.useDb(dbName)

//dual uniqueness
ProjectSchema.index({ name: 1, ownerAddress: 1 }, { unique: true })



export type IProject = Require_id<
InferSchemaType<typeof ProjectSchema>
>
 

export const Project = dbConnection.model<IProject, Model<IProject>>('projects', ProjectSchema)
 