import axios from 'axios'
import chai, { expect } from 'chai'
import { ethers, Wallet } from 'ethers'
 
  
import { disconnectTestDatabase, initTestDatabase } from './util/test-utils'
  
import ProductController from '../controllers/product-controller'
import { Product } from '../dbextensions/product-extension'
import { mongoIdToString } from '../lib/mongo-helper'

import {stubProject} from "../modules/project-module"

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
