
import axios from "axios";


import ApiKeyRow from "@/views/components/api-key-row/Main.jsx";

import { useState, useEffect } from 'react';
 
import { useOutletContext } from 'react-router-dom';

import { observer } from "mobx-react";
import {observe} from 'mobx'

import { Tab } from "@/views/base-components/Headless";
import SimpleButton from "@/views/components/simple-button/Main"

import { getBackendServerUrl } from '../../../lib/app-helper'




function Main(  ) {

  //figure out how to make this work 
     
    const [web3Store] = useOutletContext(); // <-- access context value

    console.log('web3Store' , web3Store)

    let statusFilter 

   // const [pendingTransaction, pendingTransactionSet] = useState(null)
    const [apiKeys, apiKeysSet] = useState(null) 


 
    const createApiKey = async () => {
      console.log('start create key')
      const backendApiUri = `${getBackendServerUrl()}/v1/apikey`
      let response = await axios.post(backendApiUri,{
       
          publicAddress: web3Store.account,
          authToken: web3Store.authToken 
        
      }) 
  
      if(!response || !response.data ) return undefined 
  
      console.log({response})

      loadApiKeys()
    //  let {apiKeys} = response.data.data
  
      //return apiKeys 
    }


  const fetchApiKeys = async () => {
    console.log('start fetch keys')
    const backendApiUri = `${getBackendServerUrl()}/v1/apikeys`
    let response = await axios.get(backendApiUri,{
      params:{
        publicAddress: web3Store.account,
        authToken: web3Store.authToken 
      }
    }) 

    if(!response || !response.data ) return undefined 

    console.log({response})
    let apiKeys = response.data.data

    return apiKeys 
  }
 
/*
   useEffect(() => {
      async function loadApiKeys() {
        console.log('loading api keys')
       
        try{ 
          const keys = await fetchApiKeys()
          console.log({keys})

          apiKeysSet(keys)
        }catch(e){
          console.error(e)
        }
      }

      //loadApiKeys()
   })*/


   const loadApiKeys = async (newFilter) => {
    console.log('loading api keys')
       
        try{ 
          const keys = await fetchApiKeys()
          console.log({keys})

          apiKeysSet(keys)
        }catch(e){
          console.error(e)
        }
   }

   observe(web3Store, 'account', function() {
    console.log('acct:', web3Store.account); 
  });
  
  observe(web3Store, 'authorized', function() {
    console.log('acct:', web3Store.account);
    loadApiKeys()
  });
   

 //load api keys on mount 
 useEffect(()=>{
  loadApiKeys()
}, []) // <-- empty dependency array


/*
    useEffect(() => {
      const pollForPending = setInterval(async () => {
        console.log('fetch pending')
        const pendingTransaction = await fetchPendingTransaction()
  
        pendingTransactionSet(pendingTransaction)
      }, 5000);

      return () => clearInterval(pollForPending); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])
    
    
    */

  



  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2">
       
      </div>
      <div className="intro-y box pt-4 px-5 pb-4 mt-2 flex flex-col items-center">
      
        <div className="flex flex-row w-full"> 
          <div className="flex flex-grow"></div>
          {web3Store.authorized && <div className="flex ">
            <SimpleButton
            customClass="hover:bg-slate-300"
            clicked={() => createApiKey()}
            >  New Api Key </SimpleButton> 
          </div> }
        </div>




    




        <div className="pt-4 px-2 pb-16 w-full">
      
      
        {/* BEGIN:   Title */}
        <div className="text-center">
          <div className="text-xl  mt-5">
            API Keys
          </div>
          <div className="text-base text-slate-500 mt-3">
           
          </div>
          <a href="" className="  block text-primary text-base">
             
          </a>
        </div>
        {/* END: Tx Title */}
        {/* BEGIN: Tx Content */}

        <div className="w-full">


{/*
   <Tab.Group>
    <Tab.List variant="boxed-tabs">
        <Tab>
            <Tab.Button className="w-full py-2" as="button" clicked={()=>{setStatusFilter(undefined)}}>
                All
            </Tab.Button>
        </Tab>
        <Tab>
            <Tab.Button className="w-full py-2" as="button" clicked={()=>{setStatusFilter('pending')}}>
                Pending
            </Tab.Button> 
        </Tab>
        <Tab>
            <Tab.Button className="w-full py-2" as="button" clicked={()=>{setStatusFilter('finalized')}}>
                Finalized
            </Tab.Button>             
        </Tab>
        <Tab>
            <Tab.Button className="w-full py-2" as="button" clicked={()=>{setStatusFilter('denied')}}>
                Denied
            </Tab.Button> 
        </Tab>
    </Tab.List> 
    <Tab.Panels className="mt-5">
        <Tab.Panel className="leading-relaxed">
          </Tab.Panel>
          <Tab.Panel className="leading-relaxed">
          </Tab.Panel>
          <Tab.Panel className="leading-relaxed">
          </Tab.Panel>
          <Tab.Panel className="leading-relaxed">
          </Tab.Panel>
    </Tab.Panels>

</Tab.Group> 
  */ }

      {!web3Store.authorized  && <div className="px-4 py-16 text-lg font-bold"> Sign in to view your api keys </div>}
          
          

          {web3Store.account && apiKeys && apiKeys.map((item,index)=>{ 
            return (

              <ApiKeyRow
                key={item._id}
                web3Store ={web3Store}
                apiKeyData = {item}

                        
              ></ApiKeyRow>

          
            )
          })}
        </div>
            
    
        {/* END: Tx Content */}
      </div>
      </div>

    </>
  );
}

export default observer(Main);


 