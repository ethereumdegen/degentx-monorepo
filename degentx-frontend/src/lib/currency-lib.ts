import { Provider } from "@ethersproject/abstract-provider"
import { ethers } from "ethers"

 
import Erc20Abi from '@/config/abi/erc20.abi.json'

import  contractsConfig from '@/config/contracts-config.json'

export async function approve(spender:string, amount:string, networkName:string, provider: Provider){

    let localConfig:any = contractsConfig[networkName]
    
    let currencyContract = new ethers.Contract(localConfig['currency'].address, Erc20Abi, provider)

    return await currencyContract.approve(spender,amount)
}

export async function approveAndCall(spender:string, amount:string, data:string, networkName:string, provider: Provider){

    let localConfig:any = contractsConfig[networkName]
    
    let currencyContract = new ethers.Contract(localConfig['currency'].address, Erc20Abi, provider)

    let options ={

        gasLimit: 200000
    }

    return await currencyContract.approveAndCall(spender,amount,data,options)
}


export async function allowance(holder:string, spender:string, networkName:string, provider: Provider){

    let localConfig:any = contractsConfig[networkName]
    
    let currencyContract = new ethers.Contract(localConfig['currency'].address, Erc20Abi, provider)

    let amt =  await currencyContract.allowance(holder,spender)

    return amt.toString()
}


export async function balanceOf(holder:string, networkName:string, provider: Provider){

    let localConfig:any = contractsConfig[networkName]
    
    let currencyContract = new ethers.Contract(localConfig['currency'].address, Erc20Abi, provider)

    let amt = await currencyContract.balanceOf(holder)

    return amt.toString()
}

 
