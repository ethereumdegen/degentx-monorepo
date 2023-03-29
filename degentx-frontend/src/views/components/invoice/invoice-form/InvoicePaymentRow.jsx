import { useState } from 'react';

import { observer } from "mobx-react";

import {
    Lucide, 
  } from "@/base-components";
 
 
 

function InvoicePaymentRow({  currentRowData, onUpdatedPayToAddress, onUpdatedPayToAmount   }) {
  const [formData, setFormData] = useState({});

  {/*
   add value ..
  */}

  return (
    <div className="flex flex-row p-2 my-2 "> 

      <input
      type="text"
      name="payToAddress"
      placeholder="Pay To Address"
      value={currentRowData.payToAddress}
      required={true}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      onChange={(event)=>{onUpdatedPayToAddress(event.target.value)}}
      />
     

      <input
        type="text"
        name="payAmount"
        placeholder="Pay Amount"
        value={currentRowData.payToAmount}
        required={true}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        onChange={(event)=>{onUpdatedPayToAmount(event.target.value)}}
      />
      

        
    </div>
    
     
  );
}



export default observer(InvoicePaymentRow);