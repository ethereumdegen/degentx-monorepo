
import { Schema, Model, InferSchemaType, model, Require_id } from 'mongoose'

import { ModelWithTimestamps } from './types'

export const UserSchema = new Schema(
  {
    
    publicAddress: { type: String, required:true, unique:true, index:true }, 
   
  },
  {
    pluginTags: ['withTimestamps'],
  }
) 
 

export const UserSessionSchema = new Schema(
  {
    
    userId: { type: String, required:true },
    sessionToken: {type: String, required: true}
   
  },
  {
    pluginTags: ['withTimestamps'],
  }
) 
 
 

export type IUserWithoutTimestamp = Require_id<
  InferSchemaType<typeof UserSchema>
>
export type IUser = ModelWithTimestamps<IUserWithoutTimestamp>

export const User = model<IUser, Model<IUser>>('users', UserSchema)

 

export type IUserSessionWithoutTimestamp = Require_id<
InferSchemaType<typeof UserSessionSchema>
>
export type IUserSession = ModelWithTimestamps<IUserSessionWithoutTimestamp>

export const UserSession = model<IUserSession, Model<IUserSession>>('usersessions', UserSessionSchema)