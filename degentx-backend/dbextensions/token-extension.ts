import { Schema, Model, InferSchemaType, model, Require_id } from 'mongoose'

import { ModelWithTimestamps } from './types'

export const NfTokenSchema = new Schema(
  {
    contractAddress: { type: String, required: true, index: true },
    tokenId: { type: String, required: true, index: true },
    assetIdentifier: {
      type: String,
      required: true,
      index: true,
      unique: true,
    }, //this is  contractAddress:tokenId
    tokenType: { type: String, required: true },
    assetName: { type: String },
    displayName: { type: String, required: true }, //for ens this is the xxx.eth
    imageUri: { type: String },
    manifestUri: { type: String },
  },
  {
    pluginTags: ['withTimestamps'],
  }
)

//remove me ?
NfTokenSchema.index({ contractAddress: 1, tokenId: 1 }, { unique: true })

export type INfTokenWithoutTimestamp = Require_id<
  InferSchemaType<typeof NfTokenSchema>
>
export type INfToken = ModelWithTimestamps<INfTokenWithoutTimestamp>

export const NfToken = model<INfToken, Model<INfToken>>('nftokens', NfTokenSchema)



export const MintedTokenSchema = new Schema(
  {
    contractAddress: { type: String, required: true, index: true },
    tokenId: { type: String, required: true, index: true },
    status: {type:String},
    lastSeededAt : {type: Number}
  } 
)


export type IMintedToken = Require_id<
  InferSchemaType<typeof MintedTokenSchema>
> 
export const MintedToken = model<IMintedToken, Model<IMintedToken>>('mintedtokens', MintedTokenSchema)

