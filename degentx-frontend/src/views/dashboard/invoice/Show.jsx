
import axios from "axios";

 
import { useState, useEffect } from 'react';
 
import { useOutletContext, useParams } from 'react-router-dom';

import { observer } from "mobx-react";
import {observe} from 'mobx'

import { Tab } from "@/views/base-components/Headless";
import SimpleButton from "@/views/components/simple-button/Main" 
import TinyBadge from "@/views/components/tiny-badge/Main"

import { getBackendServerUrl } from '@/lib/app-helper'

import InvoicesList from "@/views/components/invoice/invoices-list/Main"


function Main(  ) {
 
     
    const [web3Store] = useOutletContext(); // <-- access context value

    console.log('web3Store' , web3Store)
 
 
    const [invoice, invoiceSet] = useState(null)

    const { invoiceUUID } = useParams();
  

  const fetchInvoice = async ( ) => {

    let uuid = invoiceUUID;

    console.log('fetching invoice', uuid )
    const backendApiUri = `${getBackendServerUrl()}/v1/invoice`
    let response = await axios.get(backendApiUri,{
      params:{
        uuid,
        publicAddress: web3Store.account,
        authToken: web3Store.authToken 
      }
    }) 

    if(!response || !response.data ) return undefined 

    console.log({response})
    let invoice = response.data.data

    return invoice 
  }
  

   const loadInvoice = async ( ) => {
    console.log('loading invoice')
       
        try{ 
          const invoice = await fetchInvoice( )
          console.log({invoice})

          invoiceSet(invoice)
        }catch(e){
          console.error(e)
        }
   }

   observe(web3Store, 'account', function() {
    console.log('acct:', web3Store.account); 
  });
  
  observe(web3Store, 'authorized', function() {
    console.log('acct:', web3Store.account);
    loadInvoice( )
  });
   

 //load on mount 
 useEffect(()=>{
  loadInvoice( )
}, []) // <-- empty dependency array

 



  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2">
       
      </div>
      <div className="intro-y box pt-4 px-5 pb-4 mt-2 flex flex-col items-center">
      
     
 

        <div className="pt-4 px-2 pb-16 w-full">
      
      
        {/* BEGIN:   Title */}
        {invoice && 
        <div className=" mt-2 mb-5 ">
          <div className="text-xl   my-2 ">
          {invoice.invoiceUUID}
          </div>
          <TinyBadge
            customClass="my-2 bg-black text-white"
          >
           invoice
          </TinyBadge>
         
          <a href="" className="  block text-primary text-base">
             
          </a>
        </div>
        }
        {/* END: Tx Title */}
        {/* BEGIN: Tx Content */}

        <div className="w-full">

 
 
        
        {invoice &&
      
        <div className="flex flex-col">

         
            <div className="px-4 py-16 text-lg font-bold">
              Invoice
            </div>
             

            <div className="flex flex-col">



              <div> token currency </div>


              <div> total amount </div>


              <div>pay this invoice btn</div>

            </div>
         
         </div>
         
         
         }
          
          

          
        </div>
            
    
        {/* END: Tx Content */}
      </div>
      </div>

    </>
  );
}

export default observer(Main);


 