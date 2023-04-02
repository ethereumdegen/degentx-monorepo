import axios from 'axios'
import chai, { expect } from 'chai'
import { ethers, Wallet } from 'ethers'
 
  
import { disconnectTestDatabase, initTestDatabase } from './util/test-utils'
  
import ProductController from '../controllers/product-controller'
import { Product } from '../dbextensions/product-extension'
import { mongoIdToString } from '../lib/mongo-helper'

import {stubProject} from "../modules/project-module"
import { PaymentEffect } from '../dbextensions/payment-effect-extension'

let productController = new ProductController()

describe('Product Controller', () => {
 
  

    before(async () => { 

        await initTestDatabase();
 

        let deleted = await Product.deleteMany({})
    })

    after(async () => {

        await disconnectTestDatabase();
     
    })



    it('should create product', async () => {

        let wallet = Wallet.createRandom()

       let project:Project = await stubProject({
            name:'testproject',
            ownerAddress: wallet.address
       })

       const projectId = mongoIdToString(project._id);

       console.log({projectId})

       let created = await productController.createProduct(
            {fields: {

                name:'api_access',

                projectId,

                publicAddress: wallet.address,

                authToken: 'test_auth_token'

            }}
        )
        
        console.log(created.error)
        expect(created.success).to.eql(true)
        expect(created.data).to.exist
    })





    it('should have product access', async () => {


        let wallet = Wallet.createRandom()
       
  
 
         //compute uuid using payspec.js on the frontend 
        let invoiceUUID = "0x000000"
 
        
        let createdProduct = await Product.create({
            name: 'test_product',
            projectId: "test_project_id",
        })


        let createdEffect = await PaymentEffect.create({

            invoiceUUID,
            productReferenceId: createdProduct._id,
            targetPublicAddress: wallet.address,
            effectType: "product_access_for_account"

        })


        let hasAccess = await productController.hasProductAccess({
            fields: {
                productId: createdProduct._id,
                publicAddress: wallet.address

            }

        })

        expect(hasAccess.success).to.eql(true)

        

    })

    it('should not have product access', async () => {


        let wallet = Wallet.createRandom()
       
  
 
         //compute uuid using payspec.js on the frontend 
        let invoiceUUID = "0x000000"
 
        
        let createdProduct = await Product.create({
            name: 'test_product-2',
            projectId: "test_project_id",
        })

 

        let hasAccess = await productController.hasProductAccess({
            fields: {
                productId: createdProduct._id,
                publicAddress: wallet.address

            }

        })

        expect(hasAccess.success).to.eql(false)

        

    })


   /*  const ownerAddress = ethers.constants.AddressZero
     const contractAddress = ethers.constants.AddressZero
     const transactionHash = "0x0"
     const blockHash = "0x0"


     const event:ContractEvent = {
         name: 'NameRegistered',
         signature: '0x0',
         args: ['peperares.eth','0x0',ownerAddress],
         address: contractAddress,
         data: '',
         transactionHash,
         blockNumber: 0,
         blockHash,
         logIndex: 0
     }

     let indexed = await indexerEnsRegistrarController.onEventEmitted(event)
      
     const eventArgs:any = event.args
     expect(indexed.name).to.eql(eventArgs[0])*/
    
  
    

  
})
