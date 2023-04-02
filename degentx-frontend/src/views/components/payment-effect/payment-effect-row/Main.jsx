import {
    Lucide, 
  } from "@/base-components";
 

import { useNavigate } from 'react-router-dom';
import SimpleButton from '@/views/components/button/SimpleButton'
 

import { observer } from "mobx-react";

function PaymentEffectRow({web3Store, paymentEffectData}) {

  let navigate = useNavigate();

  
  console.log({paymentEffectData})


 

  return (
    <div className="border-slate-200 border-2 rounded p-4 my-4 w-full">
     
    <div className="flex flex-col">
    <div className="flex flex-row w-full">  

    {paymentEffectData.effectType}

        <div className="flex flex-grow flex-col ">
         {paymentEffectData && <div className="flex flex-row my-2">
            <div className='font-bold  '> {paymentEffectData.productName } </div>
          
          </div> }

        
          
       </div>


       <div className="flex flex-row"> 
        <div> 
          {paymentEffectData && <div 
          className={`mx-4 p-2 capitalize font-bold bg-slate-200 border-2 border-gray-400 cursor-pointer`}
          
          > 
          {paymentEffectData.targetPublicAddress}
          </div>}
         </div>
        
         </div> 
      
    </div>

    <div className="flex flex-row w-full flex-grow"> 

      <div className="flex flex-grow"></div>
     
    </div>

    </div>
    
    </div>
  )

}

  


export default observer(PaymentEffectRow);


