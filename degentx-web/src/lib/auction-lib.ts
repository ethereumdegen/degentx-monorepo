import { Provider } from "@ethersproject/abstract-provider"
import { ethers } from "ethers"


import  JpegsNftAbi from '../config/abi/jpegsNft.abi.json'
 
import MemesAuctionAbi from '../config/abi/memesAuction.abi.json'

import  contractsConfig from '../config/contracts-config.json'

export async function getMintPrice(blockNumber:string, networkName:string, provider: Provider){

    let localConfig:any = contractsConfig[networkName]
    
    let auctionContract = new ethers.Contract(localConfig['auction'].address, MemesAuctionAbi, provider)

    let price =  await auctionContract.getMintPrice(blockNumber)

    return price.toString()
}

export async function getAuctionStarted( networkName:string, provider: Provider){

    let localConfig:any = contractsConfig[networkName]
    
    let auctionContract = new ethers.Contract(localConfig['auction'].address, MemesAuctionAbi, provider)

    let started =  await auctionContract.auctionStarted()

    return started
}

 
export async function buyout(price:string, recipient:string, networkName:string, provider: Provider){

    let localConfig:any = contractsConfig[networkName]
    
    let auctionContract = new ethers.Contract(localConfig['auction'].address, MemesAuctionAbi, provider)
    console.log(price,recipient)
    return await auctionContract.buyout(price,recipient,
        {gasLimit: 400000})
 
}
