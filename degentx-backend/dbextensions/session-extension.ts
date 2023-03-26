

import { Schema, Model, InferSchemaType, model, Require_id } from 'mongoose'

import { ModelWithTimestamps } from './types'

export const ChallengeTokenSchema = new Schema(
  {
   
    challenge: { type: String, required: true},
    publicAddress: { type: String },
    
   
  },
  {
    pluginTags: ['withTimestamps'],
  }
) 
 



//NOT USED 
export const AuthenticationTokenSchema = new Schema(
    {
      token: { type: String, required:true  },
      publicAddress: { type: String, required:true  }, 
     
    },
    {
      pluginTags: ['withTimestamps'],
    }
  ) 

  

export type IChallengeTokenWithoutTimestamp = Require_id<
  InferSchemaType<typeof ChallengeTokenSchema>
>
export type IChallengeToken = ModelWithTimestamps<IChallengeTokenWithoutTimestamp>

export const ChallengeToken = model<IChallengeToken, Model<IChallengeToken>>('challengetokens', ChallengeTokenSchema)


export type IAuthenticationTokenWithoutTimestamp = Require_id<
  InferSchemaType<typeof AuthenticationTokenSchema>
>
export type IAuthenticationToken = ModelWithTimestamps<IAuthenticationTokenWithoutTimestamp>

export const AuthenticationToken = model<IAuthenticationToken, Model<IAuthenticationToken>>('authenticationtokens', AuthenticationTokenSchema)