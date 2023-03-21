import { ethers } from 'ethers'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HARDHAT_NETWORK_NAME } from 'hardhat/plugins'
import { deploy } from '../helpers/deploy-helpers'
  

const deployFn: DeployFunction = async (hre:any) => {

   
   
  let deployer_key =  process.env.PRIVATE_KEY!


  const jpegsNft = await deploy<any>({
    from: deployer_key,
    contract: 'JpegsNFT',
    args: [ ],
    
    skipIfAlreadyDeployed: false,
    hre,
  } )


  const tokenAddress = "0xb6ed7644c69416d67b522e20bc294a9a9b405b31";
  const nftAddress = jpegsNft.address  

  const auction = await deploy<any>({
    from:deployer_key,
    contract: 'MemesAuction',
    args: [ nftAddress, tokenAddress ],
    
    skipIfAlreadyDeployed: false,
    hre, 
  })
 


}

// tags and deployment
deployFn.tags = ['auction']
deployFn.dependencies = [
  
]
export default deployFn
