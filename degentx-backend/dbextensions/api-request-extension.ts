

import mongoose, { Schema, Model, InferSchemaType, model, Require_id } from 'mongoose'

import { ModelWithTimestamps } from './types'

import {getDatabaseName} from '../lib/app-helper'

export const ApiRequestSchema = new Schema(
  {
   
    key: { type: String, required: true, index:true  },

    action: { type: String, required: true, index:true  },
    magnitude: { type: Number, default: 0 },
 
   
  },
  {
    pluginTags: ['withTimestamps'],
  }
) 
 
 

const primaryDB = mongoose.connection.useDb(getDatabaseName());





export type IApiRequestWithoutTimestamp = Require_id<
  InferSchemaType<typeof ApiRequestSchema>
>
export type IApiRequest = ModelWithTimestamps<IApiRequestWithoutTimestamp>

export const ApiRequest = primaryDB.model<IApiRequest, Model<IApiRequest>>('api_requests', ApiRequestSchema)

 