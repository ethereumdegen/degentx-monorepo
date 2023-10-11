import { useState, useEffect } from "react";

import {
  useOutletContext,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import axios from 'axios'

import { observer } from "mobx-react";
import { observe } from "mobx";

import Modal from "@/views/components/modal/Main";

import SignInRequiredWarning from "@/views/components/sign-in-required-warning/Main";
import SimpleButton from "@/views/components/button/SimpleButton";

import InvoiceForm from "@/views/components/invoice/invoice-form/Main.jsx";

import { addInvoice } from "@/lib/invoice-lib";
import {
  applyProtocolFeeToPaymentElements,
  generatePayspecInvoiceSimple,
  getCurrencyTokenAddress,
  PayspecPaymentElement,
  getNetworkNameFromChainId,
  getPayspecRandomNonce,
  generatePayspecInvoice,
  getPayspecContractAddress,
  getMetadataHash,
  getPaymentElementsFromInvoice,
  userPayInvoice,
} from "payspec-js";

import { BigNumber, Contract, ethers, utils } from "ethers";

import AlertBanner from "@/views/components/alert-banner/Main";
import tw from "tailwind-styled-components";

/*

This is the smart invoice ! 

http://localhost:8080/checkout?tokenAddress=0x0000000000000000000000000000000000000010&payTo=0xb6ed7644c69416d67b522e20bc294a9a9b405b31&payAmount=5000&chainId=11155111

*/



function currency_amount_raw_to_formatted  (amt_raw =0, decimals = 0)   {
  let amount_raw_bignumber = BigNumber.from(amt_raw);

  // Convert raw amount into formatted amount by considering decimals
  let divisor = BigNumber.from('10').pow(decimals);
  let amount_formatted_bignumber = amount_raw_bignumber.div(divisor);
  let remainder = amount_raw_bignumber.mod(divisor);

  // Construct human-readable string with padded remainder
  let remainder_str = remainder.toString().padStart(decimals, '0');
  
  // Remove unnecessary trailing zeros from the remainder
  remainder_str = remainder_str.replace(/0+$/, '');

  // If remainder_str becomes empty after trimming, just set the final formatted amount to the integer part
  if (remainder_str === '') {
    return amount_formatted_bignumber.toString();
  } else {
    return `${amount_formatted_bignumber}.${remainder_str}`;
  }
}




function Main() {
  const [web3Store, sidebarStore] = useOutletContext(); // <-- access context value

  const [errorMessage, setErrorMessage] = useState(null);

  const [paymentAllowedStatus, setPaymentAllowedStatus] = useState({
    allowed: true,
  });

  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [paymentElements, setPaymentElements] = useState([]);
  const [paymentsArrayBasic, setPaymentsArrayBasic] = useState([]);

  const [paymentCompleted, setPaymentCompleted] = useState(false);
  //const [transactionBroadcasted, setTransactionBroadcasted] = useState(undefined);
  
  const [redirectToUrl,setRedirectToUrl] = useState(undefined);
  const [metadata,setMetadata] = useState(undefined);

  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false)

 


  const [payToAddressPrimary,setPayToAddressPrimary] = useState(undefined)
  const [amountDueGrandTotal,setAmountDueGrandTotal] = useState(undefined)

  const [currencyTokenDecimals,setCurrencyTokenDecimals] = useState(undefined)
 
 


  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    
     
    let paymentsArrayBasic = [];

    //  const searchParams = new URLSearchParams(window.location.search);

    // Using the getAll() method, you can retrieve all values for a specific parameter as an array.

    let tokenAddress = searchParams.get("tokenAddress");
    const payTos = searchParams.getAll("payTo");
    const payAmounts = searchParams.getAll("payAmount");

    let chainId = parseInt(searchParams.get("chainId")) || 1;

    let duration = parseInt(searchParams.get("duration")) || 60 * 60 * 24 * 30; // 30 days

    let nonce = searchParams.get("nonce") || getPayspecRandomNonce();

    let expiration =
      searchParams.get("expiration") ||
      Math.floor(Date.now() / 1000) + duration;

    let networkName = getNetworkNameFromChainId(chainId);

    let payspecAddress = getPayspecContractAddress(networkName);

    console.log({ payspecAddress });

    let title = searchParams.get("title") || undefined;
    let description = searchParams.get("description") || undefined;

    //Metadata Params
    let metadata = {
      title,
      description,
    };

    setMetadata(metadata)

    //for now - need to update payspec js w this code!!!
    let metadataHash = getMetadataHash(metadata);

    let redirectTo = searchParams.get("redirectTo");
    let expectedUuid = searchParams.get("expectedUuid");

    setRedirectToUrl( redirectTo  )


    if (expectedUuid && !expectedUuid.startsWith("0x")) {
      expectedUuid = "0x".concat(expectedUuid);
    }

    let invoiceData = {
      payspecContractAddress: payspecAddress,
      metadataHash,
      nonce,
      token: tokenAddress,
      chainId,
      payToArray: payTos,
      amountsDueArray: payAmounts,
      expiresAt: expiration,
    };

   
    // let testInvoiceUuid = getInvoiceUuidTest(invoiceData); //remove me
    //this is matching now !!!

    for (let i in payTos) {
      paymentsArrayBasic.push({
        payTo: payTos[i],
        amountDue: payAmounts[i],
      });
    }

    setPaymentsArrayBasic(paymentsArrayBasic);

    let generatedInvoiceBeforeFees = generatePayspecInvoice({
      payspecContractAddress: payspecAddress,
      tokenAddress,
      chainId,
      paymentsArray: paymentsArrayBasic,
      metadataHash,
      nonce,
      expiration,
    });

    if (generatedInvoiceBeforeFees?.invoiceUUID != expectedUuid) {
      console.log(
        "WARN: Invoice uuid is not as expected {} {} ",
        generatedInvoiceBeforeFees?.invoiceUUID,
        expectedUuid
      );

      setPaymentAllowedStatus({
        allowed: false,
        reason: "Invoice parameters are unexpected",
      });
    }

    //need to apply the protocol fee at the level BEFORE This soo uuid doesnt break

    /*
    let generatedInvoice = generatePayspecInvoice({
      payspecContractAddress: payspecAddress,
      tokenAddress,
      chainId,
      paymentsArray: applyProtocolFeeToPaymentElements(paymentsArrayBasic),
      metadataHash,
      nonce,
      expiration,
    });*/

    setGeneratedInvoice(generatedInvoiceBeforeFees);

    setInvoiceUuidToCheck(generatedInvoiceBeforeFees.invoiceUUID);
 

    let paymentElements = getPaymentElementsFromInvoice(
      generatedInvoiceBeforeFees
    );

    setPaymentElements(paymentElements);

    console.log({ paymentElements });
  }, []); // <-- empty dependency array

  observe(web3Store, "account", function () {
    console.log("acct:", web3Store.account);
  });

  observe(web3Store, "authorized", function () {
    console.log("acct:", web3Store.account);
  });




  const [paidInvoiceData, setPaidInvoiceData] = useState(null);
  const [invoiceUuidToCheck, setInvoiceUuidToCheck] = useState(null);


  //poll for the invoice paid status 
  useEffect(() => {
    const fetchData = async () => {
        try { 

         

            if (invoiceUuidToCheck != null) {
              console.log("try fetch for paid invoices ", invoiceUuidToCheck)
                let invoice_status_endpoint_url = "https://api.degentx.com/api/paid_invoices"

                let postData = [];

                postData.push( invoiceUuidToCheck )
                        

                let response = await axios.post(invoice_status_endpoint_url, postData);

                if (response.status == 200 && response.data && response.data.length > 0){
                  console.log("got paid invoice result !! ", response.data  )

                  let paidInvoiceData = response.data[0]

                  setPaidInvoiceData(paidInvoiceData)
                } 

            }  
             
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetch data immediately upon mounting
    fetchData();

    // Set up the interval to fetch data every 5 seconds
    const interval = setInterval(fetchData, 5000);

    // Cleanup: clear the interval when the component is unmounted
    return () => clearInterval(interval);
}, [ invoiceUuidToCheck ]);  // Empty dependency array ensures this effect runs once when the component mounts



 


  /*
  const allowInvoicePayment = () => {
    if (generatedInvoiceUuid && generatedInvoiceUuid != expectedUuid) {
      return false;
    }

    return true;
  };*/

  //load  on mount

  /*


 payspecContractAddress: '0x...',   -- AUTOGENERATED 
  description: 'Invoice for services',
  nonce: '0x...',   -- AUTOGENERATED   
  token: '0x...',
  totalAmountDue: '1000000000000000000',
  payToArrayStringified: '["0x..."]',
  amountsDueArrayStringified: '["1000000000000000000"]',
  expiresAt: 1234567890   -- AUTOGENERATED 


*/

  // Define a styled component using Tailwind CSS classes
  const Container = tw.div`
  mx-auto
  max-w-2xl
  pb-8
`;

  const Header = tw.h1`
  text-2xl
  font-bold
  mb-4
`;

  const FlexContainer = tw.div`
  flex
  flex-col
 
  border
  rounded-md
  overflow-hidden
`;

  const FlexItem = tw.div`
  p-4
  flex-1
  text-sm
`;

  const Label = tw.div`
  font-bold
  mb-2
  text-md
`;

  const Value = tw.div`
   
`;

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2"></div>
      <div className="intro-y box pt-4 px-5 pb-4 mt-2 flex flex-col items-center">
      
      
      
      

      <div className="relative  ">
        { true  && (
          <Modal
            isOpen={paidInvoiceData}
            closeModal={() => {
              //setPurchaseModalOpen(false);
            }}
            title={`Payment Complete`}
          >
            <div className="flex flex-col">
               <div className=" p-2 m-2  ">
                This invoice has been paid in full. 
               </div>
               <div className="my-8">

              { redirectToUrl && <a 
              className="  bg-slate-500 p-2 m-2 text-white text-center rounded " 
              href={`http://${redirectToUrl}`}

              >Return to your order
              </a> }


              </div>
            </div>
 
          </Modal>
        )}
      </div> 


      
      
      
        <div className="pt-4 px-2 pb-16 w-full">
          {/* BEGIN:   Title */}

          <div className=" mt-2 mb-5 ">
            <div className="text-xl   my-2 "></div>
          </div>

          {/* END: Tx Title */}
          {/* BEGIN: Tx Content */}

          <div className="w-full">
            <div className="flex flex-col">
              <div className="px-4 mb-4 text-lg font-bold"></div>

              <div>
               

                {!generatedInvoice && <div>Unable to generate invoice</div>}

                {generatedInvoice && (
                  <>
                    {generatedInvoice.tokenAddress}

                    <div>
                      <Container>
                        <Header>Invoice Details</Header>
                        <FlexContainer>
                          {metadata && <>
                        <FlexItem>
                            <Label>Title:</Label>
                            <Value>{metadata?.title}</Value>
                          </FlexItem>
                          </> }
                       
                        
                          

                            < FlexItem  >
                                <Label>Pay To:</Label>
                                <Value>{payToAddressPrimary}</Value>
                              </FlexItem>

                              < FlexItem  >
                                <Label>Amount Due:</Label>
                                <Value>{ currency_amount_raw_to_formatted (amountDueGrandTotal, currencyTokenDecimals ) }</Value>
                              </FlexItem>

                              <FlexItem>
                                <Label>Payment Token:</Label>
                                <Value>{generatedInvoice.token}</Value>
                              </FlexItem>


                           

                          <div>
                            {!paymentAllowedStatus?.allowed && (
                              <div className="p-8 m-4 text-center bg-slate-800 hover:bg-slate-700 text-white ">
                                Error: {paymentAllowedStatus?.reason}
                              </div>
                            )}

                            {paymentAllowedStatus?.allowed &&
                              !web3Store.account && (
                                <SimpleButton
                                  customClass="py-2 my-4 text-center bg-slate-800 hover:bg-blue-400 text-white "
                                  clicked={async () => {
                                    sidebarStore.setOpen(true);
                                  }}
                                >
                                  Connect
                                </SimpleButton>
                              )}

                            {paymentAllowedStatus?.allowed &&
                              web3Store.account && (
                                <SimpleButton
                                  customClass="py-2 my-4 text-center bg-slate-800 hover:bg-blue-400 text-white "
                                  clicked={async () => {
                                    console.log("paying ", generatedInvoice);

                                    let tx = await userPayInvoice({
                                      from: web3Store.account,
                                      invoiceData: generatedInvoice,
                                      provider: web3Store.provider,
                                    });

                                    if (tx.success) {
                                   
                                      setInvoiceUuidToCheck(generatedInvoice.invoiceUUID)
                                   //   setTransactionBroadcasted({tx_hash:tx.hash, invoice_uuid:generatedInvoice.invoiceUUID} )
                                     
                                    } else {
                                      // console.log("tx is error ", tx);

                                      setErrorMessage(tx.error.toString());
                                    }
                                  }}
                                >
                                  Pay
                                </SimpleButton>
                              )}
                          </div>








                          <FlexItem >
                              <Label className="cursor-pointer" onClick={ () => { setShowAdvancedDetails( !showAdvancedDetails )  } }>
                               
                               {showAdvancedDetails && <> [ hide advanced ]</>}
                               {!showAdvancedDetails && <> [ show advanced ]</>}
                                </Label>
                             
                            </FlexItem>

                            {showAdvancedDetails && <div className=" p-4     "> 
                            <div className="text-sm p-4 box rounded overflow-x-auto " >
                               {generatedInvoice.invoiceUUID && (
                                  <FlexItem className="text-xs">
                                    <Label>Invoice UUID:</Label>
                                    <Value>{generatedInvoice.invoiceUUID}</Value>
                                  </FlexItem>
                                )} 

                                <FlexItem className="text-xs" >
                                  <Label>Expires At:</Label>
                                  <Value>{generatedInvoice.expiresAt}</Value>
                                </FlexItem> 
                              
                              <FlexItem className="text-xs">
                                <Label>Nonce:</Label>
                                <Value>{generatedInvoice.nonce}</Value>
                              </FlexItem>

                              <FlexItem className="text-xs">
                                <Label>Chain ID:</Label>
                                <Value>{generatedInvoice.chainId}</Value>
                              </FlexItem>

                                <div>
                                    {paymentsArrayBasic.map((payment, index) => (
                                  <>
                                    <FlexItem key={`payTo-${index}`} className="text-xs">
                                      <Label>Pay To:</Label>
                                      <Value>{payment.payTo}</Value>
                                    </FlexItem>
                                    <FlexItem key={`amountDue-${index}`} className="text-xs">
                                      <Label>Amount Due:</Label>
                                      <Value>{payment.amountDue}</Value>
                                    </FlexItem>
                                  </>
                                ))}
                                </div>
                                
                                  </div>
                              </div>}




                        </FlexContainer>
                      </Container>
                    </div>
                  </>
                )}

                <div></div>

                <div className="container my-8 p-2 ">
                  <AlertBanner message={errorMessage} />
                </div>
              </div>
            </div>
          </div>

          {/* END: Tx Content */}
        </div>
      </div>
    </>
  );
}

export default observer(Main);
