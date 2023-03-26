

import mongoose, { Schema, Model, InferSchemaType, model, Require_id } from 'mongoose'

import { ModelWithTimestamps } from './types'

import {getDatabaseName} from '../lib/app-helper'

export const EnsDomainSchema = new Schema(
  {
   
    contractAddress: { type: String, required: true},   
    tokenId: { type: String, required: true, unique:true },

    name: { type: String, index:true  },
    label: { type: String },
    node: { type: String, index:true, unique:true   }, 
   
    
   // resolverAddress: { type: String },

    address_eth: {type:String},

    registrant: {type:String},
    controller: {type: String},

    addressEthUpdatedAtBlock: Number,
    registrantUpdatedAtBlock: Number,
    controllerUpdatedAtBlock: Number,
    
  
   
  },
  {
    pluginTags: ['withTimestamps'],
  }
) 
 
 

const primaryDB = mongoose.connection.useDb(getDatabaseName());





export type IEnsDomainWithoutTimestamp = Require_id<
  InferSchemaType<typeof EnsDomainSchema>
>
export type IEnsDomain = ModelWithTimestamps<IEnsDomainWithoutTimestamp>

export const EnsDomain = primaryDB.model<IEnsDomain, Model<IEnsDomain>>('ens_domains', EnsDomainSchema)

 