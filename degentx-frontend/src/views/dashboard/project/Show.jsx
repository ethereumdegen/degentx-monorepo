
import axios from "axios";
import {
  Lucide, 
} from "@/base-components";

 
import { useState, useEffect } from 'react';
 
import { useOutletContext, useParams } from 'react-router-dom';

import { observer } from "mobx-react";
import {observe} from 'mobx'
 
import SimpleButton from "@/views/components/button/SimpleButton"
import TinyBadge from "@/views/components/tiny-badge/Main"

import Modal from "@/views/components/modal/Main.jsx"
import AutoForm from "@/views/components/autoform/Main.jsx"
import ProductsTree from "@/views/components/product/products-tree/Main.jsx"

import { getBackendServerUrl } from '@/lib/app-helper'

import { createProduct } from "../../../lib/product-lib";


const productFormArchitecture = {

  fields:[
      {name: 'name', type: 'text', label: 'Product Name', placeholder: 'Product Name', required: true},

  ]

}

function Main(  ) {




 
  const [isNewProductModalOpen, setNewProductModalIsOpen] = useState(false);

  const toggleNewProductModal = () => setNewProductModalIsOpen(!isNewProductModalOpen);
  const closeNewProductModal = () => setNewProductModalIsOpen(false);
 
 



    const [web3Store] = useOutletContext(); // <-- access context value
 
 
    const [project, projectSet] = useState(null) 

    const [products, productsSet] = useState(null) 

    const { projectId } = useParams();
 
  //get the router field  projectId   



  const onProductsChanged = async () => {
    await loadProducts()
  }



  const loadProducts = async (newFilter) => {
    console.log('loading products')
       
        try{ 
          const products = await fetchProducts()
          console.log({products})

          productsSet(products)
        }catch(e){
          console.error(e)
        }
   }


  const fetchProducts = async () => {

    console.log('start fetch products', projectId)
    
    const backendApiUri = `${getBackendServerUrl()}/v1/products_by_project`
    let response = await axios.get(backendApiUri,{
      params:{
        projectId: projectId,
        publicAddress: web3Store.account,
        authToken: web3Store.authToken 
      }
    }) 

    if(!response || !response.data ) return undefined 

    console.log({response})
    let products = response.data.data

    return products  

  }

  const fetchProject = async () => {
    console.log('start fetch project', projectId)
    const backendApiUri = `${getBackendServerUrl()}/v1/project`
    let response = await axios.get(backendApiUri,{
      params:{
        projectId: projectId,
        publicAddress: web3Store.account,
        authToken: web3Store.authToken 
      }
    }) 

    if(!response || !response.data ) return undefined 

    console.log({response})
    let project = response.data.data

    return project 
  }
  

   const loadProject = async (newFilter) => {
    console.log('loading project')
       
        try{ 
          const project = await fetchProject()
          console.log({project})

          if(project){

          }

          projectSet(project)
        }catch(e){
          console.error(e)
        }
   }

   observe(web3Store, 'account', function() {
    console.log('acct:', web3Store.account); 
  });
  
  observe(web3Store, 'authorized', function() {
    console.log('acct:', web3Store.account);
    loadProject()
    loadProducts()
  });
   

 //load  on mount 
 useEffect(()=>{
  loadProject()
  loadProducts()
}, []) // <-- empty dependency array

  


  return (
    <div>
 
        <Modal 
        title={'Create New Product'}
        isOpen={isNewProductModalOpen}
        closeModal={closeNewProductModal}
         >
 
                <AutoForm 
                    architecture={productFormArchitecture}
                    onSubmit={(formdata) => createProduct( {
                        name:formdata.name ,
                        projectId: projectId,
                        publicAddress: web3Store.account,
                        authToken: web3Store.authToken,
                        onFinished: () =>{ onProductsChanged(); closeNewProductModal() }
                    })}
                
                />

        </Modal>
       

      
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2">
       
      </div>
      <div className="intro-y box pt-4 px-5 pb-4 mt-2 flex flex-col items-center">
      
         

        <div className="pt-4 px-2 pb-16 w-full">
      
      
        {/* BEGIN:   Title */}
        {project && 
        <div className=" mt-2 mb-5 ">
          <div className="text-xl   my-2 ">
          {project.name}
          </div>
          <TinyBadge
            customClass="my-2 bg-black text-white"
          >
           project
          </TinyBadge>
         
          <a href="" className="  block text-primary text-base">
             
          </a>
        </div>
        }
        {/* END: Tx Title */}
        {/* BEGIN: Tx Content */}

        <div className="w-full">

 
      {!web3Store.authorized  && <div className="px-4 py-16 text-lg font-bold"> 

      Sign in to view your project
      
      </div>}
          
          

          {web3Store.account && project &&  
            <div>

              <div className="font-bold text-lg">
                Products in this Project
              </div>

            <ProductsTree
                web3Store={web3Store}
                products={products}

                onProductsChanged={() => { 
                  loadProducts();
                }}
              />


          <div className="flex flex-row w-full"> 
            <div className="flex flex-grow text-center">
          
              <SimpleButton
              customClass="hover:bg-slate-300 flex flex-row"
              clicked={() => toggleNewProductModal()}  
              >  
                <Lucide icon="PlusCircle" className="w-4 h-4 mr-1" />
                
                Add Product </SimpleButton> 

            </div>
            
          </div> 

            </div>
          } 
        </div>
            
    
        {/* END: Tx Content */}
      </div>
      </div>


    
    </div>
  );
}

export default observer(Main);


 