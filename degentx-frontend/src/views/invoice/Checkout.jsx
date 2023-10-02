import { useState, useEffect } from "react";

import {
  useOutletContext,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import { observer } from "mobx-react";
import { observe } from "mobx";

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

import AlertBanner from "@/views/components/alert-banner/Main";
import tw from "tailwind-styled-components";

/*

This is the smart invoice ! 

http://localhost:8081/checkout?tokenAddress=0xb6ed7644c69416d67b522e20bc294a9a9b405b31&payTo=0xb6ed7644c69416d67b522e20bc294a9a9b405b31&payAmount=5000&chainId=5

*/

function Main() {
  const [web3Store] = useOutletContext(); // <-- access context value

  const [errorMessage, errorMessageSet] = useState(null);

  let generatedInvoice;
  let paymentElements = [];
  let paymentsArrayBasic = [];

  try {
    //  const searchParams = new URLSearchParams(window.location.search);

    // Using the getAll() method, you can retrieve all values for a specific parameter as an array.

    const [searchParams] = useSearchParams();

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

    let description = searchParams.get("description") || "";

    //Metadata Params
    let metadata = {
      description,
    };

    let metadataHash = getMetadataHash(metadata);

    console.log(payTos, payAmounts);

    for (let i in payTos) {
      paymentsArrayBasic.push({
        payTo: payTos[i],
        amountDue: payAmounts[i],
      });
    }

    console.log({ paymentsArrayBasic });

    let paymentsArray = [];

    for (let i in payTos) {
      paymentsArray.push({
        payTo: payTos[i],
        amountDue: payAmounts[i],
      });
    }

    generatedInvoice = generatePayspecInvoice({
      payspecContractAddress: payspecAddress,
      tokenAddress,
      chainId,
      paymentsArray,
      metadataHash,
      nonce,
      expiration,
    });

    paymentElements = getPaymentElementsFromInvoice(generatedInvoice);

    console.log({ paymentElements });
  } catch (e) {
    console.error(e);
  }

  const navigate = useNavigate();

  observe(web3Store, "account", function () {
    console.log("acct:", web3Store.account);
  });

  observe(web3Store, "authorized", function () {
    console.log("acct:", web3Store.account);
  });

  const renderError = (msg) => {
    errorMessageSet(msg);
  };

  //load  on mount
  useEffect(() => {}, []); // <-- empty dependency array

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
                            <SimpleButton
                              customClass="py-2 my-4 text-center bg-slate-800 hover:bg-blue-400 text-white "
                              clicked={async () => {
                                console.log("paying ", generatedInvoice);

                                let tx = await userPayInvoice({
                                  from: web3Store.account,
                                  invoiceData: generatedInvoice,
                                  provider: web3Store.provider,
                                });
                              }}
                            >
                              Pay
                            </SimpleButton>
                          </div>
                        </FlexContainer>
                      </Container>
                    </div>
                  </>
                )}

                <div></div>

                <AlertBanner message={errorMessage} />
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
