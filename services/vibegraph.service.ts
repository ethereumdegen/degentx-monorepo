import { LoggerInstance, Service, ServiceBroker } from 'moleculer'

import AppHelper, {
    getDatabaseConnectURI,
    getEnvironmentName,
  getNetworkNameFromChainId,
  getRpcUrl,
  getAppName
} from '../degentx-backend/lib/app-helper'

import {ethers} from 'ethers'

import Vibegraph, { CustomIndexer, VibegraphConfig } from 'vibegraph'
  
import {IInvoicePayment,InvoicePaymentSchema} from "../degentx-backend/dbextensions/payspec-extension"

const contractsConfig = require('./vibegraph/contracts-config.json')

 import IndexerPayspec from './vibegraph/indexers/IndexerPayspec'
 
let PayspecABI = require( './vibegraph/abi/payspec.abi.json' )
 


const Cron = require('moleculer-cron') 

const NODE_ENVIRONMENT =  getEnvironmentName()

const MONGO_URI = getDatabaseConnectURI()


const APP_NAME = getAppName()
 


const chainId: number = 5  


export interface CustomIndexerFixed {
  abi: ethers.ContractInterface,
  handler: any, 
  type:string 
}


const customIndexers:CustomIndexerFixed[]= [];




export interface CollectionConfigRow {
  contractAddress: string
  name: string
  openseaSlug: string
}

export default class VibegraphService extends Service {
  public constructor(public broker: ServiceBroker) {
    super(broker)

    const vibegraphPromise = Promise.resolve(getVibegraphConfig()).then(
      (config) => buildVibegraph(broker, this.logger, config)
    )

    this.parseServiceSchema({
      name: 'vibegraph',
      dependencies: [
        'payspec_invoice_primary',
        'invoice_payment_primary'],
      mixins: [Cron],
      started: async (): Promise<void> => {},
      crons: [
        {
          name: 'Update Vibegraph',
          cronTime: '*/2 * * * * *', // every 2 seconds

          onTick: async () => {
            const vibegraph = await vibegraphPromise

            try {
              await updateVibegraph(broker, this.logger, vibegraph)
            } catch (e) {
              this.logger.error(e)
            }
          },
          runOnInit: async () => {
            this.logger.info('Vibegraph Cron created')

            let indexerPayspec = new IndexerPayspec(
              this.createPaymentCallback.bind(this), this.chainId
              )

            customIndexers.push({
              type:'Payspec', 
              abi: PayspecABI ,  
              handler: indexerPayspec
             })
          },
          timezone: 'America/Nipigon',
        },
      ],
    })
  }




 async createPaymentCallback(payment:IInvoicePayment){
    let created = await this.broker.call('invoice_payment_primary.create',payment)

  }

}

export async function getVibegraphConfig(): Promise<any> {
 

  const VIBE_DB_NAME = 'vibegraph'

 


  if (!chainId) throw new Error('Vibegraph: Undefined chainId')
  const networkName = getNetworkNameFromChainId(chainId)


  const localConfig = contractsConfig[networkName]

  const web3ProviderUri = getRpcUrl(networkName)

  if(!web3ProviderUri) throw new Error('Undefined web3 provider uri')

  const vibeGraphConfig:VibegraphConfig = {
    contracts: localConfig.contracts,
    dbName: VIBE_DB_NAME.concat('_').concat(NODE_ENVIRONMENT),
    indexRate: 1 * 1000, // one second
    fineBlockGap: localConfig.fineBlockGap? localConfig.fineBlockGap:10,
    courseBlockGap: localConfig.courseBlockGap?localConfig.courseBlockGap:500,
    logLevel:'debug',
    subscribe:false, 
    updateBlockNumberRate: 60*1000,
    customIndexers,
    web3ProviderUri,
   // mongoConnectURI: MONGO_URI,
  }

  return vibeGraphConfig
}

export async function buildVibegraph(
  broker: ServiceBroker,
  logger: LoggerInstance,
  vibegraphConfig: any
): Promise<any> {
  logger.info(`Vibegraph is building.`)

  const vibegraph = new Vibegraph()
  await vibegraph.init(vibegraphConfig)

  return vibegraph
}

export async function updateVibegraph(
  broker: ServiceBroker,
  logger: LoggerInstance,
  vibegraph: any
): Promise<void> {
  // put this in  loop

  logger.info(`Vibegraph is indexing.`)

  await vibegraph.indexData() // fetch the event logs from rpc

  await vibegraph.updateLedger(100) // execute callbacks on indexers from the events
}
