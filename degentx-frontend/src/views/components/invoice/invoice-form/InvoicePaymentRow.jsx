import { useState } from 'react';

import { observer } from "mobx-react";

import {
    Lucide, 
  } from "@/base-components";
 
 
 

function InvoicePaymentRow({     }) {
  const [formData, setFormData] = useState({});

  

  return (
    <div> 
        lucide icon -- payToAddressInputField, payAmountInputField 
    </div>
    
     
  );
}



export default observer(InvoicePaymentRow);