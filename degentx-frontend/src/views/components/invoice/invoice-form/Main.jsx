import { useState } from 'react';

import { observer } from "mobx-react";

import {
    Lucide, 
  } from "@/base-components";
 
 import AutoForm from '@/views/components/autoform/Main'
 import InvoicePaymentArraySection from './InvoicePaymentArraySection'

  const architecture = {
    fields:[

      {
        name: 'paymentElementArray',
        type: InvoicePaymentArraySection, 
        label: 'Payment Element Array',
        required: true,
        

      }

    ]


  }
 


function InvoiceForm({   onSubmit }) {
  const [formData, setFormData] = useState({});

  

  return (
    <AutoForm 
    
    architecture={architecture} 

    
    onSubmit={onSubmit}
    
    />
     
  );
}



export default observer(InvoiceForm);