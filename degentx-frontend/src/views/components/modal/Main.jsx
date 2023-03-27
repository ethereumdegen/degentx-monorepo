import { useState } from 'react';


import { observer } from "mobx-react";
function Modal({isOpen, closeModal, title,  children}) {
 
 

  return (
    <>
     

      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white w-11/12 sm:w-8/12 lg:w-6/12 xl:w-4/12 rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-500 text-white px-4 py-3">
                <h3 className="font-bold text-lg"> {title} </h3>
                <button onClick={closeModal} className="float-right focus:outline-none">
                  <span className="text-lg">&times;</span>
                </button>
              </div>
              <div className="p-4">
                
                   {children}
             
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


export default observer(Modal);