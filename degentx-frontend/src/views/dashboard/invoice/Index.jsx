
import axios from "axios";

 
import { useState, useEffect, useCallback , } from 'react';
 
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';

import { observer } from "mobx-react";
import {observe} from 'mobx'

import { Tab } from "@/views/base-components/Headless";
import SimpleButton from "@/views/components/button/SimpleButton" 
import TinyBadge from "@/views/components/tiny-badge/Main"

import { getBackendServerUrl } from '@/lib/app-helper'

import InvoicesList from "@/views/components/invoice/invoices-list/Main"
import TablePaginated from "../../components/table/TablePaginated";

import InvoiceTableRow from "@/views/components/table/rows/InvoiceTableRow"

function Main(  ) {
 
     
    // Add a state to trigger the force update
    const [forceUpdateToken, setForceUpdateToken] = useState(0);


    const [web3Store] = useOutletContext(); // <-- access context value

    console.log('web3Store' , web3Store)
  
  const navigate = useNavigate();
  

  const fetchInvoices = async (pageNumber) => {
   
    const backendApiUri = `${getBackendServerUrl()}/v1/invoices_by_owner`
    let response = await axios.get(backendApiUri,{
      params:{
        
        publicAddress: web3Store.account,
        authToken: web3Store.authToken 
      }
    }) 

    if(!response || !response.data ) return undefined 

    console.log({response})
    let invoices = response.data.data

    return invoices 
  }
  
/*
   const loadInvoices = async (pageNumber) => {
    console.log('loading invoices')
       
        try{ 
          const invoices = await fetchInvoices(pageNumber)
          console.log({invoices})

          //invoicesSet(product)
        }catch(e){
          console.error(e)
        }
   }*/


   const tableHeaders = [
      { displayName: 'Invoice UUID', key: 'invoiceUUID' },
      { displayName: 'Description', key: 'description' },
      { displayName: 'Status', key: 'status' }
    ];




  // Define a forceUpdate function
  const forceUpdateTable = useCallback(() => {
    setForceUpdateToken((prevToken) => prevToken + 1);
  }, []);



   observe(web3Store, 'account', function() {
    console.log('acct:', web3Store.account); 
  });
  
  observe(web3Store, 'authorized', function() {
    console.log('acct:', web3Store.account);
    //loadInvoices(1)
    forceUpdateTable()
  });
   

 //load api keys on mount 
 useEffect(()=>{
  //loadInvoices(1)
  forceUpdateTable()
}, []) // <-- empty dependency array

  


  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2">
       
      </div>
      <div className="intro-y box pt-4 px-5 pb-4 mt-2 flex flex-col items-center">
       

        <div className="pt-4 px-2 pb-16 w-full">
      
      
        {/* BEGIN:   Title */}
       
        <div className=" mt-2 mb-5 ">
          <div className="text-xl   my-2 ">
          My Invoices
          </div>
          <TinyBadge
            customClass="my-2 bg-black text-white"
          >
           invoices
          </TinyBadge>
         
          <a href="" className="  block text-primary text-base">
             
          </a>
        </div>
        
        {/* END: Tx Title */}
        {/* BEGIN: Tx Content */}

        <div className="w-full">

 

       {!web3Store.account  && 
      
         <div className="px-4 py-16 text-lg font-bold">

           Connect to view your invoices
         
         </div>

         }
        
        {web3Store.account   &&
      
        <div className="flex flex-col">

          <div className="flex flex-row">
            <div className="flex-grow"></div>
            <div className="px-4 pb-16 text-lg font-bold">
              <SimpleButton 
              customClass="hover:bg-slate-700 hover:text-white"
              clicked={() => {navigate("/dashboard/invoice/new")}}
              > 
                Add a new invoice
              </SimpleButton>
            </div>
            </div>

            <div>
 
              <TablePaginated
                headers={tableHeaders}
                rowsPerPage={25}
                fetchRows={fetchInvoices}
                tableRowComponent={InvoiceTableRow}
                forceUpdate={forceUpdateToken}
              
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


 