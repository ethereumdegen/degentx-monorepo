import axios from 'axios'
import chai, { expect } from 'chai'
import { ethers } from 'ethers'
import { ContractEvent } from 'vibegraph'
 
  
import { disconnectTestDatabase, initTestDatabase } from './util/test-utils'
  
import ProductController from '../controllers/product-controller'
import { Product } from '../dbextensions/product-extension'


let productController: ProductController|undefined

describe('Indexer Ens Registrar', () => {
 
  

    before(async () => { 

        await initTestDatabase();

         
        productController = new ProductController()

        let deleted = await Product.deleteMany({})
    })

    after(async () => {

        await disconnectTestDatabase();
     
    })



    it('should create product', async () => {

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

    

  
})
