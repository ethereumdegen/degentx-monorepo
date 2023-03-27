import {
    Lucide, 
  } from "@/base-components";
 

  import { useState } from 'react';


//import { useNavigate } from 'react-router-dom';
import SimpleButton from '@/views/components/simple-button/Main.jsx'

import ProductRow from "@/views/components/product/product-row/Main.jsx";

import { observer } from "mobx-react";
 
import Modal from '@/views/components/modal/Main.jsx'

import AutoForm from '@/views/components/autoform/Main.jsx'

import {createProject} from '@/lib/project-lib'

function ProductsTree({web3Store, products, onProductsChanged}) {

 // let navigate = useNavigate();

 //use mobx ? 
 const [isNewProjectModalOpen, setNewProjectModalIsOpen] = useState(false); 
 const [isNewProductModalOpen, setNewProductModalIsOpen] = useState(false);


 const toggleNewProjectModal = () => setNewProjectModalIsOpen(!isNewProjectModalOpen);


const projectFormArchitecture = {

    fields:[
        {name: 'name', type: 'text', label: 'Project Name', placeholder: 'Project Name', required: true},

    ]

}


  return (
     <div>
    
      <div className="absolute z-10">
        <div className="flex justify-center items-center h-screen">
        <Modal 
        title={'Create New Project'}
        isOpen={isNewProjectModalOpen}
        closeModal={toggleNewProjectModal}
         >
 
                <AutoForm 
                    architecture={projectFormArchitecture}
                    onSubmit={(formdata) => createProject( {
                        name:formdata.name ,
                        publicAddress: web3Store.account,
                        authToken: web3Store.authToken,
                        onFinished: onProductsChanged
                    })}
                
                />

        </Modal>
        </div>
      </div>

 



        {products && products.map((item,index)=>{ 

        return (
            <div className="my-8">
            <ProductRow
            key={item._id}
            web3Store ={web3Store}
            productData = {item}

                    
            ></ProductRow> 
        

            </div>
        )

        })}



         
        <div className="flex flex-row w-full"> 
            <div className="flex flex-grow text-center">
          
              <SimpleButton
              customClass="hover:bg-slate-300"
              clicked={() => toggleNewProjectModal()}  
              >  Add Project </SimpleButton> 

            </div>
            
          </div> 

  </div>
  );

}


export default observer(ProductsTree);
