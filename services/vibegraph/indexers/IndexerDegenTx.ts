 
 

import {ethers} from 'ethers' 
import { InvoicePayment } from '../../../degentx-backend/dbextensions/payspec-extension'
 
import { ContractEvent } from 'vibegraph'
import VibegraphIndexer from 'vibegraph/dist/indexers/VibegraphIndexer'
 

export default class IndexerDegenTx extends VibegraphIndexer{
      

    async onEventEmitted(evt:ContractEvent ){

        console.log('modifyLedgerByEvent', evt)

        let eventName = evt.name 
        let blockNumber = evt.blockNumber
        let transactionHash = evt.transactionHash

        if(!eventName){
            console.log('WARN: unknown event in ', evt.transactionHash )
            return 
        }
        eventName = eventName.toLowerCase()
        

        let outputs:any = evt.args
 
        let contractAddress = ethers.utils.getAddress(evt.address)
       
        
        if(eventName == 'paidinvoice' ){
              
            let uuid = (outputs['0']).toLowerCase()
            let paidBy = ethers.utils.getAddress(outputs['1'])
                         
            await IndexerDegenTx.insertPaidInvoice(  contractAddress , uuid, paidBy, blockNumber, transactionHash) 
        }
        
        
       
    }

     

    static async insertPaidInvoice( contractAddress :string, invoiceUUID:string , paidBy:string, paidAtBlock:number, transactionHash:string ){

       
       try{
        await InvoicePayment.create( { payspecContractAddress: contractAddress, invoiceUUID , paidBy , paidAtBlock, transactionHash } )
        //  await createRecord( { payspecContractAddress: contractAddress, invoiceUUID , paidBy , paidAtBlock },  PaidInvoiceDefinition , mongoDB  )  
       }catch(error){
           console.error(error)
       }
        
        
    }




}