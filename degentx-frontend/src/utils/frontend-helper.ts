

export function getEtherscanTransactionLink(
    {transactionHash,chainId}
    :{transactionHash:string,chainId:number}
    ) : string {


        return `${getEtherscanBaseUrl({chainId})}/tx/${transactionHash}`
    }

export function getEtherscanBaseUrl({chainId}:{chainId:number}) : string {


    switch(chainId){
        case 5: return "https://goerli.etherscan.io"
        default: return "https://etherscan.io"
    }
}