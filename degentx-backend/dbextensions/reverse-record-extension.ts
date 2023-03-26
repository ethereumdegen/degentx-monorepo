

import mongoose, { Schema, Model, InferSchemaType, model, Require_id } from 'mongoose'

import { ModelWithTimestamps } from './types'


import {getDatabaseName} from '../lib/app-helper'

export const ReverseRecordSchema = new Schema(
  {
    name: { type: String , index:true  },
    
    //address: { type: String, required: true , index:true, unique:true  },
    node: { type: String , index:true, unique:true   },   //nameHash(0x000.addr.reverse)

    blockNumber: {type:String} //when the event triggered 
  },
  {
    pluginTags: ['withTimestamps'],
  }
) 


const primaryDB = mongoose.connection.useDb(getDatabaseName());


export type IReverseRecordWithoutTimestamp = Require_id<
  InferSchemaType<typeof ReverseRecordSchema>
>
export type IReverseRecord = ModelWithTimestamps<IReverseRecordWithoutTimestamp>

export const ReverseRecord = primaryDB.model<IReverseRecord, Model<IReverseRecord>>('reverse_records', ReverseRecordSchema)

 