
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

import AutoForm from '@/views/components/autoform/Main.jsx'

function Main(  ) {
 
     
    const [web3Store] = useOutletContext(); // <-- access context value
 
 
    const [product, productSet] = useState(null) 


    const { productId } = useParams();
  
 
   
   observe(web3Store, 'account', function() {
    console.log('acct:', web3Store.account); 
  });
  
  observe(web3Store, 'authorized', function() {
    console.log('acct:', web3Store.account);
    
  });
   

 //load api keys on mount 
 useEffect(()=>{
  
}, []) // <-- empty dependency array

 

const invoiceFormArchitecture = {

    fields:[
        {name: 'name', type: 'text', label: 'Invoice Name', placeholder: 'Invoice Name', required: true},

    ]

} 


  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2">
       
      </div>
      <div className="intro-y box pt-4 px-5 pb-4 mt-2 flex flex-col items-center">
      
     
 

        <div className="pt-4 px-2 pb-16 w-full">
      
      
        {/* BEGIN:   Title */}
         
        <div className=" mt-2 mb-5 ">
          <div className="text-xl   my-2 ">
           Create Invoice
          </div>
          
        
        </div>
       
        {/* END: Tx Title */}
        {/* BEGIN: Tx Content */}

        <div className="w-full">

 

       {!web3Store.authorized  && 
      
         <div className="px-4 py-16 text-lg font-bold">

           Sign in to create an Invoice
         
         </div>

         }
        
        {web3Store.authorized &&  
      
        <div className="flex flex-col">

         
            <div className="px-4 py-16 text-lg font-bold">
               
            </div>
             

            <div>

          
            <AutoForm
              architecture={invoiceFormArchitecture}
              onSubmit={(data) => {
                console.log('data:', data);
              }
            }
            />

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


 