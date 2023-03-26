
import mongoose, {Mongoose, Schema, Model, model, Require_id, InferSchemaType} from 'mongoose'
 
 
 

  export const ProjectSchema = new Schema(
    {
      
        name: { type:String, required:true,  indexed: true  },
        ownerAddress: {type:String,required:true,  indexed: true },
      
      
    } 
  ) 
 
mongoose.pluralize(null);


//dual uniqueness
ProjectSchema.index({ name: 1, ownerAddress: 1 }, { unique: true })



export type IProject = Require_id<
InferSchemaType<typeof ProjectSchema>
>
 

export const Project = model<IProject, Model<IProject>>('projects', ProjectSchema)
 