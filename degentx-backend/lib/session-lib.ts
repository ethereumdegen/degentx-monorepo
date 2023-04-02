import {ethers} from 'ethers'

import crypto from 'crypto'

import {bufferToHex, toBuffer, hashPersonalMessage, fromRpcSig, ecrecover, pubToAddress} from 'ethereumjs-util'
 
import {getDatabaseConnectURI,getAppName,getEnvironmentName} from './app-helper';
import { ApiKey, AuthenticationToken, ChallengeToken } from '../dbextensions/session-extension';
import { User, UserSession } from '../dbextensions/user-extension';
import { IChallengeToken } from '../dbextensions/session-extension'
import { mongoIdToString } from './mongo-helper';
import { AssertionResult } from '../interfaces/types';
import { isAssertionSuccess } from './assertion-helper';
 
   
    export function toChecksumAddress(publicAddress:string):string|undefined
    {
        try{ 
            return ethers.utils.getAddress(publicAddress)
        }catch(e){
            return undefined 
        }
    }


    export function generateServiceNameChallengePhrase(
        unixTime:string,
        serviceName:string,
        publicAddress: string
        ){
        
      
      let formattedPublicAddress = toChecksumAddress(publicAddress)


      const accessChallenge = `Signing in to ${serviceName} as ${formattedPublicAddress} at ${unixTime.toString()}`

      return accessChallenge
    }
    
    export async function  upsertNewChallengeForAccount(
        publicAddress:string, 
        serviceName: string, 
        challengeGenerator?: Function
         )  : Promise<AssertionResult<any>> {

     if(!publicAddress){
         return {success:false,error:"invalid address provided"}
     }

      const unixTime = Date.now().toString()
 
      let formattedPublicAddress = toChecksumAddress(publicAddress)

      if(!formattedPublicAddress){
          return {success:false, error:"Invalid public address provided"}
      }
     
      let challenge;

      if(challengeGenerator){
        challenge = challengeGenerator( unixTime, serviceName, formattedPublicAddress )
      }else{
        challenge = generateServiceNameChallengePhrase(  unixTime, serviceName, formattedPublicAddress)
      }

     
      
      let upsert = await ChallengeToken.findOneAndUpdate(
        { publicAddress: formattedPublicAddress },
        { challenge: challenge, createdAt: unixTime },
        {new:true, upsert:true }
      )
     
      
      return {success:true, data: challenge} 
    }



    export async function findActiveChallengeForAccount(publicAddress: string) : Promise<AssertionResult<{challenge?:any}>> {
      const ONE_DAY = 86400 * 1000

      let formattedPublicAddress = toChecksumAddress(publicAddress)

      if(!formattedPublicAddress){
        return {success:false, error:"Invalid public address provided"}
    }
  
      const existingChallengeToken = await ChallengeToken.findOne({
        publicAddress: formattedPublicAddress,
        createdAt: { $gt: Date.now() - ONE_DAY },
      })

      if(!existingChallengeToken){
        return {success:false, error:"Could not find active challenge"}
      }
  
      return {success:true, data: existingChallengeToken }
    }

    export function generateNewAuthenticationToken() : string {
      return crypto.randomBytes(16).toString('hex')
    }

    export async function findActiveAuthenticationTokenForAccount( publicAddress: string) : Promise<AssertionResult<any>> {
      const ONE_DAY = 86400 * 1000
  
      let formattedPublicAddress = toChecksumAddress(publicAddress)


      if(!formattedPublicAddress) return {success:false, error:'provided invalid public address'}
  
      const existingAuthToken = await AuthenticationToken.findOne({
        publicAddress: formattedPublicAddress,
        createdAt: { $gt: Date.now() - ONE_DAY },
      })
  
      return {success:true, data: existingAuthToken}
    }

    export async function upsertNewAuthenticationTokenForAccount( publicAddress: string) : Promise<AssertionResult<any>>{
      const unixTime = Date.now().toString()
  
      const newToken = generateNewAuthenticationToken()
      
       
      let formattedPublicAddress = toChecksumAddress(publicAddress)

      if(!formattedPublicAddress) return {success:false, error:'provided invalid public address'}
  
      let upsert = await AuthenticationToken.findOneAndUpdate(
          { publicAddress: formattedPublicAddress },
          { publicAddress: formattedPublicAddress , token: newToken, createdAt: unixTime },
          {new:true, upsert:true }
        )
      
  
      return {success:true, data:upsert}
    }


    /*
      Checks for either an auth token or an api key for the account.
    */

    export async function validateAuthenticationTokenForAccount(
    
      publicAddress: string,
      authToken: string
    )  : Promise<AssertionResult<any>>  {
      //always validate if in dev mode
      if (getEnvironmentName() == 'development') {
        return {success:true, data:undefined }
      }
  
      const ONE_DAY = 86400 * 1000
  
      let formattedPublicAddress = toChecksumAddress(publicAddress)
      if(!formattedPublicAddress) return {success:false, error:'provided invalid public address'}
  
      const existingAuthToken = await AuthenticationToken.findOne({
        publicAddress: formattedPublicAddress,
        token: authToken,
        createdAt: { $gt: Date.now() - ONE_DAY },
      })


      if(existingAuthToken){

        return {success:true, data:existingAuthToken} 

      }else{

       
        const existingApiKey = await ApiKey.findOne({
          publicAddress: formattedPublicAddress,
          key: authToken,
        })

        if(existingApiKey){

          return {success:true, data:existingApiKey} 
        
        }else{
          return {success:false, error:'no active authentication token found'}

        }
        
      }
      
    //  return {success:false, error:existingAuthToken} 
    }
    

    /*
    This method takes a public address and the users signature of the challenge which proves that they know the private key for the account without revealing the private key.
    If the signature is valid, then an authentication token is stored in the database and returned by this method so that it can be given to the user and stored on their client side as their session token.
    Then, anyone with that session token can reasonably be trusted to be fully in control of the web3 account for that public address since they were able to personal sign. 
    */
    export async function generateAuthenticatedSession(publicAddress:string, signature:string, challenge?:string) : Promise<AssertionResult<any>>{
      if(!challenge){
        let challengeRecordResponse = await findActiveChallengeForAccount( publicAddress)
          
        if(challengeRecordResponse && isAssertionSuccess(challengeRecordResponse)){
              
            challenge = challengeRecordResponse.data.challenge
        }
      }

      if(!challenge){
        return {success:false, error:'no active challenge found for user'} 
      }

      let validationResponse = validatePersonalSignature(publicAddress,signature,challenge)

      if(!isAssertionSuccess(validationResponse)){
        return validationResponse
      }

      let authToken = await upsertNewAuthenticationTokenForAccount( publicAddress)

      return {success:true, data: authToken} 

    }

    export function validatePersonalSignature(
      fromAddress: string,
      signature: string,
      challenge: string,
      signedAt?: number
    ) : AssertionResult<any> {

      if(!signedAt) signedAt = Date.now()
      //let challenge = 'Signing for Etherpunks at '.concat(signedAt)
  
      let recoveredAddress = ethJsUtilecRecover(challenge, signature)
  
      if (!recoveredAddress) { 
        return {success:false, error:"unable to recover personal signature"}
      }
  
      let formattedRecoveredAddress = toChecksumAddress(recoveredAddress)
  
      if (formattedRecoveredAddress != toChecksumAddress(fromAddress)) {
        
        return {success:false, error:"unable to recover personal signature"}
      }
  
      const ONE_DAY = 1000 * 60 * 60 * 24
  
      if (signedAt < Date.now() - ONE_DAY) {
        return {success:false, error:"personal signature expired"}
      }
  
      return {success:true, data:undefined}
    }
  
    export function ethJsUtilecRecover(msg: string, signature: string) {
         
      try{
        const res = fromRpcSig(signature)
  
        const msgHash = hashPersonalMessage(Buffer.from(msg))
  
        const pubKey = ecrecover(
          toBuffer(msgHash),
          res.v,
          res.r,
          res.s
        )
        const addrBuf = pubToAddress(pubKey)
        const recoveredSignatureSigner = bufferToHex(addrBuf)
        console.log('rec:', recoveredSignatureSigner)
  
        return recoveredSignatureSigner
  
      }catch(e){
        console.error(e)
  
      }
  
      return null 
    }
  





    export async function createNewAuthenticatedUserSession(publicAddress:string) : Promise<AssertionResult<any>> {
        
        

        let matchingUser;
        let matchingUserResponse = await User.findOne( {publicAddress} )

        if(!matchingUserResponse ){
            //create a new udser 

            let createdUserResponse = await insertNewUser( { publicAddress } )
            if(!isAssertionSuccess(createdUserResponse)) return createdUserResponse

            let createdUser =  createdUserResponse.data

            matchingUser = createdUser
        }else{
            matchingUser = matchingUserResponse
        }

      
        //look for a user that already exists with the email address 


        
        if(!matchingUser){
            return {success:false, error:"Unable to find or create user for auth flow"}
        }
        
        console.log({matchingUser})

        let sessionCreationResponse = await insertUserSession(matchingUser)

        if(!isAssertionSuccess(sessionCreationResponse)) return sessionCreationResponse 

        //@ts-ignore
        return  {success: true,  data: sessionCreationResponse.data.sessionToken}
      
    }



    export async function  insertNewUser( {publicAddress}:{publicAddress:string }) : Promise<AssertionResult<any>> { 
         
        let currentTime = Date.now().toString()

        let newRecordResponse = await User.create( {
            publicAddress, 
            createdAt: currentTime,
            updatedAt: currentTime
        }   )

        if(!newRecordResponse){
            return {success:false, error:'Could not create user record'}
        }

        return {success:true, data: newRecordResponse}
    }

    export async function  insertUserSession(user:any): Promise<AssertionResult<any>> {

        let sessionToken = generateNewRandomBytes()

        if(!user || !user._id){
          return {success:false, error:'Could not create session for undefined user'}
        }

        let parentUserId = mongoIdToString(user._id)

        let currentTime = Date.now().toString()

        let newRecordResponse = await UserSession.create( {
            userId:parentUserId,
            sessionToken,
            updatedAt: currentTime,
            createdAt: currentTime

        }  )

        if(!newRecordResponse){
            return newRecordResponse
        }

        return {success:true, data: {sessionToken, userId: parentUserId}}
    }
 

    export function generateNewRandomBytes(){
      return crypto.randomBytes(24).toString('hex');
    }