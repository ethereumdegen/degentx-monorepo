import { useState } from 'react';

import { observer } from "mobx-react";

import {
    Lucide, 
  } from "@/base-components";
 
 
 

function InvoicePaymentRow({   handleChange   }) {
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
      required={true}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
   
      
      />
     

      <input
        type="text"
        name="payAmount"
        placeholder="Pay Amount"
        required={true}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  
      />
      

        
    </div>
    
     
  );
}



export default observer(InvoicePaymentRow);