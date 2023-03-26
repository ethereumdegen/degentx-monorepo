 

//import ExtensibleMongoDB , {DatabaseExtension} from 'extensible-mongoose'
import PayspecDBExtension, { PaidInvoiceDefinition } from '../../server/dbextensions/PayspecDBExtension'



import {ethers} from 'ethers' 
 

export default class IndexerDegenTx {
     
 

    async modifyLedgerByEvent(evt ){

        console.log('modifyLedgerByEvent', evt)

        let eventName = evt.event 
        let blockNumber = evt.blockNumber

        if(!eventName){
            console.log('WARN: unknown event in ', evt.transactionHash )
            return 
        }
        eventName = eventName.toLowerCase()
        

        let outputs = evt.returnValues
 
        let contractAddress = ethers.utils.getAddress(evt.address)
       
        
        if(eventName == 'paidinvoice' ){
              
            let uuid = (outputs['0']).toLowerCase()
            let paidBy = ethers.utils.getAddress(outputs['1'])
                         
            await IndexerDegenTx.insertPaidInvoice(  contractAddress , uuid, paidBy, blockNumber, this.mongoDB) 
        }
        
        
       
    }

     

    static async insertPaidInvoice( contractAddress , invoiceUUID , paidBy, paidAtBlock , mongoDB){

       
       try{
          await createRecord( { payspecContractAddress: contractAddress, invoiceUUID , paidBy , paidAtBlock },  PaidInvoiceDefinition , mongoDB  )  
       }catch(error){
           console.error(error)
       }
        
        
    }




}