import { useState } from 'react';

import { observer } from "mobx-react";

import {
    Lucide, 
  } from "@/base-components";
 
  import SimpleButton from '@/views/components/simple-button/Main'
 
 import InvoicePaymentRow from './InvoicePaymentRow';

function InvoicePaymentElementSection({     }) {
  const [paymentRows, setPaymentRows] = useState( [] );

  

  return (
    <div> 
      <div>
      {paymentRows && Array.isArray(paymentRows) &&  paymentRows.map((paymentRow) => (
           <InvoicePaymentRow
           
           /> 
      ))}
      </div>

      <div>


        <SimpleButton>
          Add new payment row
        </SimpleButton>
      </div>
   

    </div>
    
     
  );
}



export default observer(InvoicePaymentElementSection);