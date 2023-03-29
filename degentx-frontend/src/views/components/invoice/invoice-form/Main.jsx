import { useState } from 'react';

import { observer } from "mobx-react";

import {
    Lucide, 
  } from "@/base-components";
 
 import AutoForm from '@/views/components/autoform/Main'
 import InvoicePaymentArraySection from './InvoicePaymentArraySection'


import {getCurrencyTokenAddress} from 'payspec-js'


import { addInvoice } from '@/lib/invoice-lib';

  const architecture = {
    fields:[

      {
        name: 'name',
        type: 'text',
        label: 'Name',
        placeholder: 'Name',
        required: true 
      },

      {
        name: 'network',
        type: 'select',
        label: 'Network',
        placeholder: 'Network',
        required: true ,
        options:[
          {label: 'Ethereum Mainnet', value: 1},
          {label: 'Ethereum Rinkeby', value: 4},
          {label: 'Ethereum Goerli', value: 5},
        ]
      },

      {
        name: 'tokenAddress',
        type: 'select',
        label: 'Token',
        placeholder: 'Token',
        required: true ,
        options:[
          {label: 'Ether', value: 'ether'},
          {label: '0xBTC', value: '0xbtc'},
         
        ]
      },

      {
        name: 'paymentElementArray',
        type: InvoicePaymentArraySection, 
        label: 'Payment Elements',
        required: true,
        

      }

    ]


  }
 


function InvoiceForm({   onSubmit }) {
  const [formData, setFormData] = useState({});

  

  return (
    <AutoForm 
    
    architecture={architecture} 

    
    onSubmit={ (  ) =>{

      console.log('on submit invoice')

      const chainId = formData.network


      const tokenAddress = getCurrencyTokenAddress({
        tokenName: formData.token,
        chainId
      })

      //build me !! 
      const paymentsArray = [] 

      console.log({paymentsArray})


      addInvoice( {
        chainId: formData.network,
        description: formData.name,
        tokenAddress ,
        paymentsArray ,


      })

    }}
    
    />
     
  );
}



export default observer(InvoiceForm);