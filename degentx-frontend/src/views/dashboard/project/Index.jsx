
import axios from "axios";



import { useState, useEffect } from 'react';
 
import { useOutletContext } from 'react-router-dom';

import { observer } from "mobx-react";
import {observe} from 'mobx'

import { Tab } from "@/views/base-components/Headless";
import SimpleButton from "@/views/components/simple-button/Main"

import ProjectsTree from "@/views/components/project/projects-tree/Main.jsx"

import { getBackendServerUrl } from '@/lib/app-helper'



function Main(  ) {
 
     
    const [web3Store] = useOutletContext(); // <-- access context value

    console.log('web3Store' , web3Store)

    let statusFilter 
 
    const [products, productsSet] = useState(null) 
    const [projects, projectsSet] = useState(null) 

 


  const fetchProjects = async () => {
    console.log('start fetch projects')
    const backendApiUri = `${getBackendServerUrl()}/v1/projects`
    let response = await axios.get(backendApiUri,{
      params:{
        publicAddress: web3Store.account,
        authToken: web3Store.authToken 
      }
    }) 

    if(!response || !response.data ) return undefined 

    console.log({response})
    let projects = response.data.data

    return projects 
  }
 

  


   const loadProjects = async (newFilter) => {
    console.log('loading projects')
       
        try{ 
          const projects = await fetchProjects()
          console.log({projects})

          projectsSet(projects)
        }catch(e){
          console.error(e)
        }
   }
 

   observe(web3Store, 'account', function() {
    console.log('acct:', web3Store.account); 
  });

  //load products on authorized 
  observe(web3Store, 'authorized', function() {
    console.log('acct:', web3Store.account);
   
    loadProjects()
  });
   

 //load api keys on mount 
 useEffect(()=>{
   
  loadProjects()
}, []) // <-- empty dependency array

 
  



  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2 "  >

      
       
      </div>
      <div className="intro-y box pt-4 px-5 pb-4 mt-2 flex flex-col items-center h-screen " >
        


        <div className="pt-4 px-2 pb-16 w-full">
      
      
        {/* BEGIN:   Title */}
        <div className="text-center">
          <div className="text-xl  mt-5">
            Projects
          </div>
          <div className="text-base text-slate-500 mt-3">
           
          </div>
          <a href="" className="  block text-primary text-base">
             
          </a>
        </div>
        {/* END: Tx Title */}
        {/* BEGIN: Tx Content */}

        <div className="w-full   ">

      <div className="container mx-auto lg:w-1/2">

 

      {!web3Store.authorized  && <div className="px-4 py-16 text-lg font-bold"> 
     
      Sign in to view your projects
      
      </div>}
           

         {web3Store.account && web3Store.authorized && !projects &&  
           
              <div className="my-8">
                  No projects found.        

              </div>
            
          }

          {web3Store.account && web3Store.authorized &&  

              <ProjectsTree
                web3Store={web3Store}
                projects={projects}

                onProductsChanged={() => {
                  loadProjects();
                  
                }}
              />

          
          }

 


         
        </div>
    
        </div>
    
        {/* END: Tx Content */}
      </div>
      
      </div>

    </>
  );
}

export default observer(Main);


 