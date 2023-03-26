require('dotenv').config()

//export const fullNetworkConfig = require('../config/networkConfig.json')

import web3Utils from 'web3-utils'

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
const MONGO_CONNECT_URI = process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost:27017'

const pjson = require('../package.json')

const APP_NAME = pjson.databasePrefix
const DATABASE_PREFIX = pjson.databasePrefix

type VALID_ENVIRONMENT_NAMES = 'development' | 'staging' | 'production' | 'test'

const serverConfig = require('../config/serverConfig.json')


// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class AppHelper {
  static getAppName(): string {
    return APP_NAME
  }

 
  
}

export function getEnvironmentName(): VALID_ENVIRONMENT_NAMES {
  const envName = NODE_ENV ? NODE_ENV : 'development'

  if (
    envName != 'development' &&
    envName != 'staging' &&
    envName != 'production' &&
    envName != 'test'
  )
    throw new Error(`Invalid environment ${envName} `)
  return envName
}


export function getTestApiKey(): string {
  return "testapikey"
}


export function getNetworkName(): string {
  let envName = getEnvironmentName()

  return serverConfig[envName].networkName
}

export function getDatabaseConnectURI(): string {
  if (!MONGO_CONNECT_URI) throw new Error('Missing ENV variable: MONGO_URI')

  return MONGO_CONNECT_URI
}

export function getDatabasePrefix(): string {
  return DATABASE_PREFIX
}

export function getNetworkNameFromChainId(chainId: number): string {
  if (chainId == 4) return 'rinkeby'
  if (chainId == 5) return 'goerli'
  if (chainId == 137) return 'polygon'

  return 'mainnet'
}

export function toChecksumAddress(input: string): string {
  return web3Utils.toChecksumAddress(input)
}

export function getRpcUrl(networkName: string): string | undefined {
  switch (networkName) {
    case 'goerli':
      return process.env.GOERLI_PROVIDER_URL
    case 'rinkeby':
      return process.env.RINKEBY_PROVIDER_URL

    default:
      return process.env.MAINNET_PROVIDER_URL
  }
}


export function getAppName() : string {
  return APP_NAME
}
 

export function getDatabaseName(customPrefix?:string) : string {

  let prefix = customPrefix ? customPrefix : getAppName()

  return prefix.concat('_').concat(getEnvironmentName())
}

export function getAlchemyApiRootUri(networkName:string){

  switch(networkName){
    case "mainnet":return "https://eth-mainnet.g.alchemy.com/v2/"
    case "goerli":return "https://eth-goerli.g.alchemy.com/v2/"

    default: return "https://eth-mainnet.g.alchemy.com/v2/"

  }

}