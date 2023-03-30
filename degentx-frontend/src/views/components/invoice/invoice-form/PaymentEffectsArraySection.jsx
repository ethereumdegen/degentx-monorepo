import { useState } from 'react';

import { observer } from "mobx-react";

import {
    Lucide, 
  } from "@/base-components";
 
  import SimpleButton from '@/views/components/simple-button/Main'
 
 import PaymentEffectRow from './PaymentEffectRow';

function PaymentEffectsArraySection({  onUpdated   }) {
  const [effectRows, setEffectRows] = useState( [] );


  //load this from api ? 
  const [productOptions, setProductOptions] = useState( [] );


  

  
  const addEffectRow = () => {


    let newEffectRows = [...effectRows]
    newEffectRows.push({
        productReferenceId: '0',
        targetPublicAddress: '0x...'
    })

    setEffectRows(newEffectRows)
   onUpdated('effectRowsData',[...newEffectRows])

  }

  const removeEffectRow= (index) => {

    let newEffectRows = [...effectRows]
    
    newEffectRows.splice(index)

    setEffectRows(newEffectRows)
    onUpdated('effectRowsData',[...newEffectRows])

  }


  const updateEffectRowInput = (index,fieldName,value) => {

    const effectRowsData = [...effectRows]

    effectRowsData[index] = Object.assign({},effectRowsData[index]);

    if(fieldName == 'productReferenceId'){
        effectRowsData[index].productReferenceId = value
    }else if(fieldName == 'targetPublicAddress'){
        effectRowsData[index].targetPublicAddress = value
    }else {
      throw new Error('Unknown field type:',fieldName)
    }
 
    //to send back down to children for rendering 
    setEffectRows([...effectRowsData])

    //to send to callback up to parent 
    onUpdated('effectRowsData',[...newEffectRows])


  }

  return (
    <div className="p-4 my-4 container box "> 

      <div className="font-bold text-lg">
                   
      </div>   

      <div>
      {effectRows && Array.isArray(effectRows) &&  effectRows.map((effectRow, index) => (
           <PaymentEffectRow
              key={index}
              currentRowData={effectRow}
              productOptions={productOptions}
              onUpdatedProductReferenceId={(updatedProductReferenceId) => updateEffectRowInput(index,'productReferenceId',updatedProductReferenceId)}
              onUpdatedTargetPublicAddress={(updatedTargetPublicAddress) => updateEffectRowInput(index,'targetPublicAddress',updatedTargetPublicAddress)}
              onRemoveRow={()=>{removeEffectRow(index)}}
              /> 
      ))}
      </div>  

      <div>

      <div className="inline-block">


        <SimpleButton
        customClass={"hover:bg-gray-700 hover:text-white flex flex-row text-lg  "}
        clicked={() => {
          addEffectRow()
        }}
        
        >
         <Lucide icon="PlusCircle" className="w-8 h-8 mr-2" />

          Add new payment effect
        </SimpleButton>
      </div>
      </div>
   

    </div>
    
     
  );
}



export default observer(PaymentEffectsArraySection);