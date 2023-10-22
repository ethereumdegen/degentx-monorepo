import {BigNumber} from 'ethers'

export function getEtherscanAccountLink(
    {publicAddress,chainId}
    :{publicAddress:string,chainId:number}
    ) : string {
        return `${getEtherscanBaseUrl({chainId})}/account/${publicAddress}`
    }

export function getEtherscanTransactionLink(
    {transactionHash,chainId}
    :{transactionHash:string,chainId:number}
    ) : string {


        return `${getEtherscanBaseUrl({chainId})}/tx/${transactionHash}`
    }

export function getEtherscanBaseUrl({chainId}:{chainId:number}) : string {


    switch(chainId){
        case 5: return "https://goerli.etherscan.io"
        case 11155111: return "https://sepolia.etherscan.io"
        default: return "https://etherscan.io"
    }
}

export function getNetworkName({chainId}:{chainId:any}) : string {
   console.log('chain id', chainId)

  

    switch(( BigNumber.from ( chainId  ?? 0 ) .toString())){
        case '11155111': return "Sepolia"
        case '5': return "Goerli"
        case '1': return "Mainnet"
        case '0': return "Any Network"

        default: return "Unknown Network"
    }

}


export function getDateFormatted({date,seconds}:{date?:number,seconds?:number}) : string {
    
    if(date){
        return new Date(date).toLocaleString()
    }
    if(seconds){
        return new Date(seconds*1000).toLocaleString()
    }
    
    return "Unknown Date"
}

