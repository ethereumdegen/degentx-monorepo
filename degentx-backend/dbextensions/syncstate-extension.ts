import { Schema, Model, InferSchemaType, model, Require_id } from 'mongoose'

import { ModelWithTimestamps } from './types'


import {getDatabaseName} from "../lib/app-helper"

const dbName = getDatabaseName()
 

export const SyncStateSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String },
  },
  {
    pluginTags: ['withTimestamps'],
  }
)

// used for full text search
SyncStateSchema.index({ key: 'text' })


let dbConnection = mongoose.connection.useDb(dbName)


export type ISyncStateWithoutTimestamp = Require_id<
  InferSchemaType<typeof SyncStateSchema>
>
export type ISyncState = Require_id<
  ModelWithTimestamps<ISyncStateWithoutTimestamp>
>

export const SyncState = dbConnection.model<ISyncState, Model<ISyncState>>(
  'SyncState',
  SyncStateSchema
)
