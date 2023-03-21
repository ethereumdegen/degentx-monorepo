import {
    Lucide,
    
    
  } from "@/base-components";

 

import { useNavigate } from 'react-router-dom';
import SimpleButton from '@/views/components/simple-button/Main.jsx'


import { observer } from "mobx-react";

function ApiKeyRow({web3Store, apiKeyData}) {

  let navigate = useNavigate();

  
  console.log({apiKeyData})


 

  return (
    <div className="border-slate-200 border-2 rounded p-4 my-4 w-full">
     
    <div className="flex flex-col">
    <div className="flex flex-row w-full">  
         

        <div className="flex flex-grow flex-col ">
         {apiKeyData && <div className="flex flex-row my-2">
            <div className='font-bold  '>API Key </div>
            <div className='mx-4'> {apiKeyData.key }</div>
          </div> }

        
          
       </div>


       <div className="flex flex-row"> 
        <div> 
          {apiKeyData && <div 
          className={`mx-4 p-2 capitalize font-bold bg-slate-200 border-2 border-gray-400 cursor-pointer`}
          onClick={()=>{navigate(`/dashboard/apikey/${apiKeyData.key}`)}}
          > 
            View
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

  


export default observer(ApiKeyRow);


