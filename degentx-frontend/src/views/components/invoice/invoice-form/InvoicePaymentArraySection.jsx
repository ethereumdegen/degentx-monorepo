import { useState } from 'react';

import { observer } from "mobx-react";

import {
    Lucide, 
  } from "@/base-components";
 
  import SimpleButton from '@/views/components/simple-button/Main'
 
 import InvoicePaymentRow from './InvoicePaymentRow';

function InvoicePaymentElementSection({     }) {
  const [paymentRows, setPaymentRows] = useState( [] );

  
  const addPaymentRow = () => {


    let newPaymentRows = [...paymentRows]
    newPaymentRows.push({
      payToAddress: '',
      payToAmount: ''
    })

    setPaymentRows(newPaymentRows)
  }

  return (
    <div className="p-4 my-4 container box "> 

      <div className="font-bold text-lg">
                   
      </div>   

      <div>
      {paymentRows && Array.isArray(paymentRows) &&  paymentRows.map((paymentRow) => (
           <InvoicePaymentRow
           
           /> 
      ))}
      </div>  

      <div>

      <div className="inline-block">


        <SimpleButton
        customClass={"hover:bg-gray-700 hover:text-white flex flex-row text-lg  "}
        clicked={() => {
          addPaymentRow()
        }}
        
        >
         <Lucide icon="PlusCircle" className="w-8 h-8 mr-2" />

          Add new payment row
        </SimpleButton>
      </div>
      </div>
   

    </div>
    
     
  );
}



export default observer(InvoicePaymentElementSection);