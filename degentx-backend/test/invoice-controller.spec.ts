import axios from 'axios'
import chai, { expect } from 'chai'
import { ethers, Wallet } from 'ethers'
 
  
import { disconnectTestDatabase, initTestDatabase } from './util/test-utils'
   
import { mongoIdToString } from '../lib/mongo-helper'

import {stubProject} from "../modules/project-module"
import { PayspecInvoice as PayspecInvoiceModel } from '../dbextensions/payspec-extension'
import InvoiceController from '../controllers/invoice-controller'

import {ETH_ADDRESS, getPayspecInvoiceUUID, PayspecInvoice, getPayspecRandomNonce} from 'payspec-js'

let invoiceController = new InvoiceController()

describe('Invoice Controller', () => {
 
  

    before(async () => { 

        await initTestDatabase();

        let deleted = await PayspecInvoiceModel.deleteMany({})

    })

    after(async () => {

        await disconnectTestDatabase();
     
    })


    it('should create invoice and compute uuid', async () => {

       let wallet = Wallet.createRandom()

       let expiration = ( Date.now() / 1000 ) + 50000

       

       const invoice: PayspecInvoice = {
           payspecContractAddress: '0x568cD537Ed5C70aE1A2b1B0Fd6DE6D94c7FAdD77',
           description: 'PROD_ID_1245', //can use product id here 
           nonce: getPayspecRandomNonce(),
           token: ETH_ADDRESS,
           totalAmountDue: '100',
           payToArrayStringified: `["${wallet.address}"]`,
           amountsDueArrayStringified: `["100"]`,
           expiresAt: expiration
       }

        //compute uuid using payspec.js on the frontend 
       let computedUuid = getPayspecInvoiceUUID(invoice)

       if(!computedUuid) throw new Error('Could not compute uuid')

       invoice.invoiceUUID = computedUuid

       //the controller will also compute the uuid from the other params and will reject if it doesnt match the expected  that was passed in 
       let created = await invoiceController.addInvoice(
            {fields: {

                invoice, 

                publicAddress: wallet.address,

                authToken: 'test_auth_token'

            }}
        )
            
        console.log(created.error)
        expect(created.success).to.eql(true)
        expect(created.data).to.exist
    })

    
  
    

  
})
