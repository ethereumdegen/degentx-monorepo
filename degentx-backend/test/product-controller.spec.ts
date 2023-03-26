import axios from 'axios'
import chai, { expect } from 'chai'
import { ethers } from 'ethers'
 
  
import { disconnectTestDatabase, initTestDatabase } from './util/test-utils'
  
import ProductController from '../controllers/product-controller'
import { Product } from '../dbextensions/product-extension'


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

       let created = await productController.createProduct(
            {fields: {

                name:'api_access',

                projectId: 'projId',

                publicAddress: ethers.constants.AddressZero,

                authToken: 'test_auth_token'

            }}
        )


    expect(created).to.exist
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
