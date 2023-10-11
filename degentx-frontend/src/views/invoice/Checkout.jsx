import { useState, useEffect } from "react";

import {
  useOutletContext,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

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

http://localhost:8081/checkout?tokenAddress=0xb6ed7644c69416d67b522e20bc294a9a9b405b31&payTo=0xb6ed7644c69416d67b522e20bc294a9a9b405b31&payAmount=5000&chainId=5

*/

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
  const [transactionBroadcasted, setTransactionBroadcasted] = useState(undefined);
  
  const [redirectToUrl,setRedirectToUrl] = useState(undefined);


  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    const getMetadataHashCustom = (metadata) => {
      let sortedEntries = Object.entries(metadata).sort((a, b) =>
        a[0].localeCompare(b[0])
      ); // Sorting by key

      let metadata_keys = [];
      let metadata_values = [];

      console.log({ sortedEntries });

      for (let [key, value] of sortedEntries) {
        if (typeof key != "undefined" && typeof value != "undefined") {
          console.log("metadata hash gen {} {} ", key, value);

          metadata_keys.push(key);
          metadata_values.push(value);
        }
      }

      const abi = ethers.utils.defaultAbiCoder;
      const params = abi.encode(
        ["string[]", "string[]"],
        [metadata_keys, metadata_values]
      ); // array to encode

      const result = ethers.utils.keccak256(params);
      /*
      const result = ethers.utils.solidityKeccak256(
        ["string[]", "string[]"],
        [metadata_keys, metadata_values]
      );*/

      console.log("computed metadata hash ", result);

      return result;
    };
     
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

    //for now - need to update payspec js w this code!!!
    let metadataHash = getMetadataHashCustom(metadata);

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

    // let generatedInvoiceUuid = generatedInvoice.invoiceUUID;

    //setPaymentAllowedStatus({ allowed: true });

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




  //poll for the payment status 

  useEffect(() => {
    // This function will be called every 5 seconds
    const fetchData = async () => {
      try {

        console.log("polling to check 1")
          if(transactionBroadcasted && transactionBroadcasted.invoice_uuid){

            console.log("polling to check 2")

          }


       // const result = await axios.get('YOUR_API_ENDPOINT');
       // setData(result.data);
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    // Call it once immediately
    fetchData();

    // Set up the interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 5000); // 5000ms = 5s

    // This is important: Clean up the interval when the component is destroyed
    return () => clearInterval(intervalId);
  }, []); // The empty array means this useEffect will run once when the component is mounted




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
  border-r
`;

  const Label = tw.div`
  font-bold
  mb-2
`;

  const Value = tw.div`
  text-sm
`;

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2"></div>
      <div className="intro-y box pt-4 px-5 pb-4 mt-2 flex flex-col items-center">
      
      
      
      

      <div className="relative  ">
        { true  && (
          <Modal
            isOpen={paymentCompleted}
            closeModal={() => {
              //setPurchaseModalOpen(false);
            }}
            title={`Payment Complete`}
          >
            <div className="flex flex-col">
               <div>
               Your payment has been completed in full. 
               </div>
               <div>

              { redirectToUrl && <a 
              className="blue-500" 
              href={redirectToUrl}
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
                {/*  
              
              */}

                {!generatedInvoice && <div>Unable to generate invoice</div>}

                {generatedInvoice && (
                  <>
                    {generatedInvoice.tokenAddress}

                    <div>
                      <Container>
                        <Header>Invoice Details</Header>
                        <FlexContainer>
                          <FlexItem>
                            <Label>Description:</Label>
                            <Value>{generatedInvoice.description}</Value>
                          </FlexItem>
                          <FlexItem>
                            <Label>Token:</Label>
                            <Value>{generatedInvoice.token}</Value>
                          </FlexItem>

                          {paymentsArrayBasic.map((payment, index) => (
                            <>
                              <FlexItem key={`payTo-${index}`}>
                                <Label>Pay To:</Label>
                                <Value>{payment.payTo}</Value>
                              </FlexItem>
                              <FlexItem key={`amountDue-${index}`}>
                                <Label>Amount Due:</Label>
                                <Value>{payment.amountDue}</Value>
                              </FlexItem>
                            </>
                          ))}

                          <FlexItem>
                            <Label>Nonce:</Label>
                            <Value>{generatedInvoice.nonce}</Value>
                          </FlexItem>

                          <FlexItem>
                            <Label>Chain ID:</Label>
                            <Value>{generatedInvoice.chainId}</Value>
                          </FlexItem>
                          <FlexItem>
                            <Label>Expires At:</Label>
                            <Value>{generatedInvoice.expiresAt}</Value>
                          </FlexItem>
                          {generatedInvoice.invoiceUUID && (
                            <FlexItem>
                              <Label>Invoice UUID:</Label>
                              <Value>{generatedInvoice.invoiceUUID}</Value>
                            </FlexItem>
                          )}

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
                                      console.log("pop up the modal ! ");

                                      setTransactionBroadcasted({tx_hash:tx.hash, invoice_uuid:generatedInvoice.invoiceUUID} )
                                     
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
