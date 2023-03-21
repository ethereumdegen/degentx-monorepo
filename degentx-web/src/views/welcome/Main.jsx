import React from 'react';

import Auction from '../partials/Auction'; 

import { observer } from "mobx-react";

import { useOutletContext } from 'react-router-dom';

function Home() {



  const [web3Store] = useOutletContext()

 


  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
 
      {/*  Page content */}
      <main className="flex-grow">

        {/*  Page sections */}
        <Auction
        
        web3Store = {web3Store}
        />

        {/*<FeatureCode />*/}

      <div>
 
        
 

      </div>


      </main>
 

     

    </div>
  );
}

export default observer(Home);