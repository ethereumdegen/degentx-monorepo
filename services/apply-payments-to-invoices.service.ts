import { LoggerInstance, Service, ServiceBroker } from 'moleculer'

import AppHelper, {
    getDatabaseConnectURI,
    getEnvironmentName,
  getNetworkNameFromChainId,
  getRpcUrl,
} from '../degentx-backend/lib/app-helper'

import {ethers} from 'ethers'

import Vibegraph, { CustomIndexer, VibegraphConfig } from 'vibegraph'
 
import mongoose, {Model,ConnectOptions} from 'mongoose'

import {IInvoicePayment,InvoicePaymentSchema} from "../degentx-backend/dbextensions/payspec-extension"

const contractsConfig = require('./vibegraph/contracts-config.json')

 import IndexerPayspec from './vibegraph/indexers/IndexerPayspec'
 
let PayspecABI = require( './vibegraph/abi/payspec.abi.json' )
 


const Cron = require('moleculer-cron') 

const NODE_ENVIRONMENT =  getEnvironmentName()

const MONGO_URI = getDatabaseConnectURI()
 
//Tell our payspec indexer that it should be creating records in the database 'degentx_NODEENV' even though our vibegraph data uses VIBEGRAPH_NODEENV'
let degenDbConnection =  mongoose.createConnection(getDatabaseConnectURI(`degentx_${NODE_ENVIRONMENT}`),{});
const invoicePaymentModel = degenDbConnection.model<IInvoicePayment, Model<IInvoicePayment>>('invoicepayments', InvoicePaymentSchema);

let indexerPayspec = new IndexerPayspec(invoicePaymentModel)
  

export default class ApplyPaymentsToInvoicesService extends Service {
  public constructor(public broker: ServiceBroker) {
    super(broker)

   
    this.parseServiceSchema({
      name: 'applypayments',
      mixins: [Cron],
      started: async (): Promise<void> => {},
      crons: [
        {
          name: 'Apply Payments To Invoices',
          cronTime: '*/10 * * * * *', // every 10 seconds

          onTick: async () => {
            

          /*  try {
              await updateVibegraph(broker, this.logger, vibegraph)
            } catch (e) {
              this.logger.error(e)
            }*/





          },
          runOnInit: async () => {
            this.logger.info('Vibegraph Cron created')
          },
          timezone: 'America/Nipigon',
        },
      ],
    })
  }
} 