import axios from 'axios'
import chai, { expect } from 'chai'
import { ethers, Wallet } from 'ethers'
 
  
import { disconnectTestDatabase, initTestDatabase } from './util/test-utils'
   
import { mongoIdToString } from '../lib/mongo-helper'

import {stubProject} from "../modules/project-module"
import { PayspecInvoice as PayspecInvoiceModel } from '../dbextensions/payspec-extension'
import InvoiceController, { validateAndCreatePaymentEffects } from '../controllers/invoice-controller'

import {ETH_ADDRESS, getPayspecInvoiceUUID, PayspecInvoice, getPayspecRandomNonce} from 'payspec-js'
import { PaymentEffect } from '../dbextensions/payment-effect-extension'
import { Product } from '../dbextensions/product-extension'

let invoiceController = new InvoiceController()

describe('Invoice Controller', () => {
 
  

    before(async () => { 

        await initTestDatabase();

        await PayspecInvoiceModel.deleteMany({})
        await Product.deleteMany({})

    })

    after(async () => {

        await disconnectTestDatabase();
     
    })


    it('should create invoice and compute uuid', async () => {

       let wallet = Wallet.createRandom()

       let expiration = Math.floor(( Date.now() / 1000 ) + 50000)

       

       const invoice: PayspecInvoice = {
           payspecContractAddress: '0x568cD537Ed5C70aE1A2b1B0Fd6DE6D94c7FAdD77',
           description: 'PROD_ID_1245', //can use product id here 
           nonce: getPayspecRandomNonce(),
           token: ETH_ADDRESS,
           chainId: '0',
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

    it('should get invoice  ', async () => {

        let wallet = Wallet.createRandom()
 
        let expiration = Math.floor(( Date.now() / 1000 ) + 50000)
        
        
 
        const invoice: PayspecInvoice = {
            payspecContractAddress: '0x568cD537Ed5C70aE1A2b1B0Fd6DE6D94c7FAdD77',
            description: 'PROD_ID_1245', //can use product id here 
            nonce: getPayspecRandomNonce(),
            token: ETH_ADDRESS,
            chainId: '0',
            payToArrayStringified: `["${wallet.address}"]`,
            amountsDueArrayStringified: `["100"]`,
            expiresAt: expiration
        }
  
 
         //compute uuid using payspec.js on the frontend 
        let computedUuid = getPayspecInvoiceUUID(invoice)
 
        if(!computedUuid) throw new Error('Could not compute uuid')
 
        invoice.invoiceUUID = computedUuid


        let createdProduct = await Product.create({
            name: 'test_product',
            projectId: "test_project_id",
        })


        let createdEffect = await PaymentEffect.create({

            invoiceUUID: computedUuid,
            productReferenceId: createdProduct._id,
            targetPublicAddress: wallet.address,
            effectType: "test_type"

        })
 
        //the controller will also compute the uuid from the other params and will reject if it doesnt match the expected  that was passed in 
        let createdInvoice = await invoiceController.addInvoice(
             {fields: {
 
                 invoice, 
 
                 publicAddress: wallet.address,
 
                 authToken: 'test_auth_token'
 
             }}
         )
        
         
         let fetched = await invoiceController.getInvoice(
            {
                query: {uuid: computedUuid}
            }
         )

        expect(fetched.success).to.eql(true)

        console.log({fetched})

        let invoiceData = fetched.data 
        
        console.log({invoiceData})

        console.log(invoiceData.paymentEffects)


        expect(invoiceData).to.exist
        expect(invoiceData.paymentEffects).to.exist
        expect(invoiceData.paymentEffects.length).to.eql(1)

        console.log(invoiceData.paymentEffects[0])
        console.log(invoiceData.paymentEffects[0].productName)

        expect(invoiceData.paymentEffects[0].productName).to.eql(createdProduct.name)
        

     })

    
  
     it('should validate and create payment effects  ', async () => {

        let wallet = Wallet.createRandom()
 
        let expiration = Math.floor(( Date.now() / 1000 ) + 50000)
        
        
 
        const invoice: PayspecInvoice = {
            payspecContractAddress: '0x568cD537Ed5C70aE1A2b1B0Fd6DE6D94c7FAdD77',
            description: 'PROD_ID_1245', //can use product id here 
            nonce: getPayspecRandomNonce(),
            token: ETH_ADDRESS,
            chainId: '0',
            payToArrayStringified: `["${wallet.address}"]`,
            amountsDueArrayStringified: `["100"]`,
            expiresAt: expiration
        }
  
 
         //compute uuid using payspec.js on the frontend 
        let computedUuid = getPayspecInvoiceUUID(invoice)
 
        if(!computedUuid) throw new Error('Could not compute uuid')
 
        invoice.invoiceUUID = computedUuid


        let createdProduct = await Product.create({
            name: 'test_product-2',
            projectId: "test_project_id",
        })


 
        //the controller will also compute the uuid from the other params and will reject if it doesnt match the expected  that was passed in 
        let createdPaymentEffects = await validateAndCreatePaymentEffects(
             
                     [{

                        invoiceUUID: computedUuid,
                        productReferenceId: createdProduct._id,
                        targetPublicAddress: wallet.address,
                        effectType: "test_type"
            
                    }],
                     computedUuid

              
         )

         console.log({createdPaymentEffects})

         expect(createdPaymentEffects.success).to.eql(true)

     })



     it('should fail to validate and create payment effects  ', async () => {

        let wallet = Wallet.createRandom()
 
        let expiration = Math.floor(( Date.now() / 1000 ) + 50000)
        
        
 
        const invoice: PayspecInvoice = {
            payspecContractAddress: '0x568cD537Ed5C70aE1A2b1B0Fd6DE6D94c7FAdD77',
            description: 'PROD_ID_1245', //can use product id here 
            nonce: getPayspecRandomNonce(),
            token: ETH_ADDRESS,
            chainId: '0',
            payToArrayStringified: `["${wallet.address}"]`,
            amountsDueArrayStringified: `["100"]`,
            expiresAt: expiration
        }
  
 
         //compute uuid using payspec.js on the frontend 
        let computedUuid = getPayspecInvoiceUUID(invoice)
 
        if(!computedUuid) throw new Error('Could not compute uuid')
 
        invoice.invoiceUUID = computedUuid


        let createdProduct = await Product.create({
            name: 'test_product-3',
            projectId: "test_project_id",
        })

        let createdPaymentEffects
        
        //the controller will also compute the uuid from the other params and will reject if it doesnt match the expected  that was passed in 
        createdPaymentEffects = await validateAndCreatePaymentEffects(
             
                     [{

                        invoiceUUID: computedUuid,
                        productReferenceId: "0",
                        targetPublicAddress: wallet.address,
                        effectType: "test_type"
            
                    }],
                     computedUuid

              
         )

      


        console.log({createdPaymentEffects})

        expect(createdPaymentEffects.success).to.eql(false)
        expect(createdPaymentEffects.error).to.eql("Could not validate payment effects")

     })

  
})
