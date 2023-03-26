import { ethers } from 'ethers'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HARDHAT_NETWORK_NAME } from 'hardhat/plugins'
import { deploy } from '../helpers/deploy-helpers'
  

const deployFn: DeployFunction = async (hre:any) => {
  const {  run, network } = hre
   
   
  const deployerKey = process.env.PRIVATE_KEY!

  const degentxDeploy = await deploy({
    contract: 'DegenTx',
    args: [ ],
    skipIfAlreadyDeployed: false,
    hre, 
    from: deployerKey
  })


}

// tags and deployment
deployFn.tags = ['primary']
deployFn.dependencies = [
  
]
export default deployFn
