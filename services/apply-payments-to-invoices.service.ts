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
 
const Cron = require('moleculer-cron') 

const NODE_ENVIRONMENT =  getEnvironmentName()
 
 
const PAGE_SIZE= 25;

export default class ApplyPaymentsToInvoicesService extends Service {
  public constructor(public broker: ServiceBroker) {
    super(broker)

   
    this.parseServiceSchema({
      name: 'applypayments',
      dependencies: [
        'payspec_invoice_primary',
        'invoice_payment_primary'],
      mixins: [Cron],
    
      started: async (): Promise<void> => {
        // Wait for the required services to start
        await this.broker.waitForServices(['payspec_invoice_primary', 'invoice_payment_primary']);
      },

      crons: [
        {
          name: 'Apply Payments To Invoices',
          cronTime: '*/2 * * * * *', // every 10 seconds

          onTick: async () => {

            const cursorId = undefined;
            
            const paymentQuery:any  = {}// cursorId ? { _id: { $gt: cursorId }, appliedToInvoiceAt:{$exists:false} } : { appliedToInvoiceAt:{$exists:false} } 
 
             
              let unappliedPayments:IInvoicePayment[] = await this.broker.call('invoice_payment_primary.find',{
                query: paymentQuery,
                sortBy: { '_id': 1 },
                limit: PAGE_SIZE
              })

              for(let unappliedPayment of unappliedPayments){


                let invoiceUUID = unappliedPayment.invoiceUUID
                let transactionHash = unappliedPayment.transactionHash
                let chainId = unappliedPayment.chainId

                let updatedPayment = await this.broker.call('invoice_payment_primary.updateOne',{
                  query:{invoiceUUID: invoiceUUID},
                  set:{ appliedToInvoiceAt: Date.now() }
                })

                let updatedInvoice = await this.broker.call('payspec_invoice_primary.updateOne',{
                  query:{invoiceUUID: invoiceUUID},
                  set:{ 
                    status: 'paid',
                    paymentTransactionHash: transactionHash,
                    paymentChainId: chainId
                  }
                })

                //only if updated invoice works do we update payment 

              } 



          },
          runOnInit: async () => {
           // this.logger.info('Vibegraph Cron created')
          },
          timezone: 'America/Nipigon',
        },
      ],
    })
  }
} 