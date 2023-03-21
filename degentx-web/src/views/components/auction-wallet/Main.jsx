 
 import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import SimpleButton from '@/views/components/simple-button/Main.jsx'
 
import { observer } from "mobx-react";
import React, { useState, useEffect } from 'react';

import {approve, allowance , balanceOf, approveAndCall } from "@/lib/currency-lib"
 
import  contractsConfig from '@/config/contracts-config.json'


import LoadingIcon from '@/views/components/loading-icon/Main.jsx'


function Main({ web3Store, mintPrice, networkName }) {

  let navigate = useNavigate();


  
   
  //const [amountApproved, amountApprovedSet] = useState(null) 
  const [tokenBalance, tokenBalanceSet] = useState(null) 

 
 
let auctionContract = contractsConfig[networkName]['auction']

 
/*
const fetchApprovalAmount = async ( ) => {
    
    if(!web3Store.active) return 

    try{  
      const amt = await allowance(
          web3Store.account,
           auctionContract.address,
            networkName,
            web3Store.provider)
    console.log({amt})
      amountApprovedSet(amt)
    }catch(e){
      console.error(e)
    }
  } 
*/



const fetchBalance = async ( ) => {


    if(!web3Store.active) return

       try{  
         const amt = await balanceOf(
             web3Store.account, 
               networkName,
               web3Store.provider)
         console.log({amt})
         tokenBalanceSet(amt)
       }catch(e){
         console.error(e)
       }
     } 
   

  // on mount 
  useEffect(()=>{
    fetchBalance() 
    //fetchApprovalAmount() 

    web3Store.registerCustomCallback('accountsChanged', fetchBalance)

    let balanceInterval = setInterval( fetchBalance, 5*1000  )
   // let approvedInterval = setInterval( fetchApprovalAmount, 4*1000  )
  }, []) // <-- empty dependency array



 
 const sufficientBalance = (balance,mintPrice) => {
  
    return  parseInt(balance) >= parseInt(mintPrice)
  }  

   

  return (
    <div className="border-slate-200 border-2 rounded p-4 my-4 w-full">
     
   
    <div className="flex flex-col w-full text-left">  
            { !web3Store.active &&
            
             <div>
                 Connect a wallet to purchase
             </div>
            }


            { web3Store.active && isNaN(parseInt(tokenBalance)) &&

                    <LoadingIcon />
            }

            { web3Store.active && !isNaN(parseInt(tokenBalance)) &&  sufficientBalance(tokenBalance, mintPrice) &&
               
                 <div>
                   
                        <div  className="mb-8 bg-orange-400 p-2 text-white font-bold ">

                        Balance: { ethers.utils.formatUnits(tokenBalance, 8 ) }

                        </div> 


                    <div>  


           

                    <SimpleButton
                    customClass="hover:bg-gray-700 hover:text-white hover:font-bold"
                    clicked={async ()=>{  await approveAndCall(
                        auctionContract.address, 
                        mintPrice,  
                        "0x",
                        networkName, 
                        web3Store.signer )  }}
                   
                   > Buyout
                    </SimpleButton>
                
                    
                    </div>
            </div>
           }


        { web3Store.active && !isNaN(parseInt(tokenBalance)) &&  !sufficientBalance(tokenBalance, mintPrice) &&
        <div>
                  <SimpleButton
                    customClass="hover:bg-gray-700 hover:text-white hover:font-bold" 
                   
                   >  Insufficient Balance  
                    </SimpleButton>

         
        </div>
        }
       

       
 
      
      
    </div>

    
 
    </div>
  )

}

  


export default observer(Main);


