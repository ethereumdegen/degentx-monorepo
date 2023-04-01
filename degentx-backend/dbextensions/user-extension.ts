
import mongoose, { Schema, Model, InferSchemaType, model, Require_id } from 'mongoose'

import { ModelWithTimestamps } from './types'



import {getDatabaseName} from "../lib/app-helper"

const dbName = getDatabaseName()


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
 

mongoose.pluralize(null);

let dbConnection = mongoose.connection.useDb(dbName)

 

export type IUserWithoutTimestamp = Require_id<
  InferSchemaType<typeof UserSchema>
>
export type IUser = ModelWithTimestamps<IUserWithoutTimestamp>

export const User = dbConnection.model<IUser, Model<IUser>>('users', UserSchema)

 

export type IUserSessionWithoutTimestamp = Require_id<
InferSchemaType<typeof UserSessionSchema>
>
export type IUserSession = ModelWithTimestamps<IUserSessionWithoutTimestamp>

export const UserSession = dbConnection.model<IUserSession, Model<IUserSession>>('usersessions', UserSessionSchema)