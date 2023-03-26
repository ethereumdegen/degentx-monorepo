

import mongoose, { Schema, Model, InferSchemaType, model, Require_id } from 'mongoose'

import { ModelWithTimestamps } from './types'

import {getDatabaseName} from '../lib/app-helper'

export const ApiKeySchema = new Schema(
  {
   
    ownerAddress: { type: String, index:true,  required: true},   
    key: { type: String, required: true, index:true , unique:true },

    status: {type: String, default: "active", index:true }
 
   
  },
  {
    pluginTags: ['withTimestamps'],
  }
) 
 
 

const primaryDB = mongoose.connection.useDb(getDatabaseName());





export type IApiKeyWithoutTimestamp = Require_id<
  InferSchemaType<typeof ApiKeySchema>
>
export type IApiKey = ModelWithTimestamps<IApiKeyWithoutTimestamp>

export const ApiKey = primaryDB.model<IApiKey, Model<IApiKey>>('api_keys', ApiKeySchema)

 