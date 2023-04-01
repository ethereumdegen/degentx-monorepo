 
 

import {ethers} from 'ethers' 
import { InvoicePayment, IInvoicePayment } from '../../../degentx-backend/dbextensions/payspec-extension'
 
import { ContractEvent } from 'vibegraph'
import VibegraphIndexer from 'vibegraph/dist/indexers/VibegraphIndexer'
 
import mongoose,{Model} from 'mongoose'
/*
invoicepayments
*/
export default class IndexerPayspec extends VibegraphIndexer{

  //  invoicePaymentModel: Model<any>

    constructor(public createPaymentCallback: (payment)=>any, public chainId:number){
        super()
    }

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
                         
            await this.insertPaidInvoice(  contractAddress , uuid, paidBy, blockNumber, transactionHash, this.chainId) 
        }
        
        
       
    }

     

    async insertPaidInvoice( contractAddress :string, invoiceUUID:string , paidBy:string, paidAtBlock:number, transactionHash:string , chainId:number){

       
       try{
        let payment:Omit<IInvoicePayment,'_id'> = { 
            payspecContractAddress: contractAddress, 
            invoiceUUID , 
            paidBy ,
            paidAtBlock,
            transactionHash,
            chainId
        }

        await this.createPaymentCallback(payment)
        
       }catch(error){
           console.error(error)
       }
        
        
    }




}