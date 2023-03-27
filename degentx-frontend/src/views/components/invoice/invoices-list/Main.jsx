import {
    Lucide, 
  } from "@/base-components";
 

  import { useState } from 'react';


 import { useNavigate } from 'react-router-dom';
import SimpleButton from '@/views/components/simple-button/Main.jsx'

import InvoiceRow from "@/views/components/invoice/invoice-row/Main.jsx";

import { observer } from "mobx-react";
 
 
 

function InvoicesList({web3Store, invoices, onInvoicesChanged}) {

  let navigate = useNavigate();
 
 

  return (
     <div> 

        {invoices && invoices.map((item,index)=>{ 

        return (
            <div className="my-8">
            <InvoiceRow
            key={item._id}
            web3Store ={web3Store}
            invoiceData = {item} 
                    
            />  
            </div>
        )

        })} 
     

  </div>
  );

}


export default observer(InvoicesList);
