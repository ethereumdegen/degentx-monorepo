
import axios from "axios";

import {ethers} from "ethers"

 
import { useState, useEffect } from 'react';
 
import { useOutletContext, useParams } from 'react-router-dom';

import { observer } from "mobx-react";
import {observe} from 'mobx'

import ViewJsonButton from '@/views/components/button/ViewJsonButton'
import SimpleButton from '@/views/components/button/SimpleButton'

import TinyBadge from "@/views/components/tiny-badge/Main"

import { getBackendServerUrl } from '@/lib/app-helper'

import { payInvoiceUsingProvider } from '@/lib/invoice-lib'

import InvoicesList from "@/views/components/invoice/invoices-list/Main"
import PaymentEffectRow from "@/views/components/payment-effect/payment-effect-row/Main"

import {getEtherscanTransactionLink} from "@/utils/frontend-helper"

import defaultProductImage from "@/assets/images/default_product_image.png"

const InvoiceSection = ({ title, children }) => {
  return <div className="container box flex flex-col mb-4">
    <div className="font-bold text-md p-2 bg-black text-white ">{title}</div>
    <div className="p-2 my-2">  {children} </div>
  
    </div>;
};

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
  
  const getInvoiceStatus = (invoice) => {

    if(invoice.paymentTransactionHash){
      return "paid"
    }

    return "requested"
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

   const payInvoice = async() => {
      console.log('paying invoice',JSON.stringify(invoice))

      const networkName = "goerli"


     // let prov =  new ethers.providers.Web3Provider(window.ethereum, "any");

 
      let paid = await payInvoiceUsingProvider(
        {
          from:web3Store.account,
          invoice,
          provider:web3Store.provider,
          networkName: networkName
        }
      )

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
        {invoice && false && 
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
              <div className="flex flex-row mb-16">
                <div className="flex-grow">
                <div className="px-4  text-lg font-bold">
                  Invoice 
                </div>

                <TinyBadge
                  customClass="my-2 bg-black text-white"
                >
                 {getInvoiceStatus(invoice)}
                </TinyBadge>

                </div>

                <div>

                <ViewJsonButton
                jsonData={invoice}
                 > 
                 View JSON 
                 </ViewJsonButton>

                 </div>


            </div>
              
         
            <div className="w-full flex flex-col ">

            <div className="flex flex-col lg:flex-row">

            <div className="flex flex-col p-4  lg:w-1/2 ">

                <div className="p-2">
                    
                    <img 
                      src={defaultProductImage}
                    />

                </div>

            {invoice.paymentEffects && invoice.paymentEffects.length > 0 &&
              <InvoiceSection
                title={"Payment Effects"}> 
                 
                  {invoice.paymentEffects.map((paymentEffect, index)=>{
                    
                    return <PaymentEffectRow 
                    key={index}
                    paymentEffectData={paymentEffect}
                    />
                      
                  } )}

                </InvoiceSection>
            }

            </div>

            <div className="flex flex-col p-4  lg:w-1/2 ">


             <InvoiceSection
              title={"Description"}> 
              {invoice.description}
              </InvoiceSection> 
            


              <InvoiceSection
              title={"Total Amount Due"}> 
              {invoice.totalAmountDue}
              </InvoiceSection>


            </div>

           
             

            </div>

              <div className="my-4">


              {!web3Store.account && !invoice.paymentTransactionHash &&
                <div>
                  Connect to web3 to pay invoice.
                </div>
              }

              {web3Store.account && !invoice.paymentTransactionHash &&
              <div className="inline">

              <SimpleButton
                customClass="bg-blue-500 hover:bg-blue-400 text-white"
                clicked={()=>{payInvoice()}}
              >
                Pay Invoice
              </SimpleButton>

              </div>
              }

            { invoice.paymentTransactionHash && 
              <div className="p-2 my-4 ">

              This invoice has been paid.  <a className={"text-blue-500"} href={getEtherscanTransactionLink(
                {
                  transactionHash: invoice.paymentTransactionHash,
                  chainId: invoice.paymentChainId
                }
                )}>View Transaction</a>

              </div>
              }

              </div>
  

           

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


 