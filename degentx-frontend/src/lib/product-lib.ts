import { Provider } from "@ethersproject/abstract-provider"
import axios from "axios"
import { ethers } from "ethers"

  
import { getBackendServerUrl } from "./app-helper"

export async function createProduct({
    name, publicAddress, authToken, onFinished
}:{
    name: string
    publicAddress:string,
    authToken:string,

    onFinished: ( ) => any
}){

    const backendApiUri = `${getBackendServerUrl()}/v1/product`
    let response = await axios.post(backendApiUri,{
        name,
        publicAddress,//: web3Store.account,
        authToken//: web3Store.authToken 
      
    }) 

    if(!response || !response.data ) return undefined 

    console.log({response})

    onFinished() 

}