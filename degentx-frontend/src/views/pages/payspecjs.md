
# Payspec-JS


A javascript library for the decentralized neutral crypto-payments protocol 'payspec' utilized by DegenTx. 

---


Install in your NodeJS app with the following command: 

```
npm i payspec-js
```



[Read the code on Github](https://github.com/payspec/payspec-js)

---

## Getting Started 

### Library Functions

**getPayspecContractDeployment(networkName: string)**: Retrieves the Payspec smart contract deployment information, including the contract address and ABI for the specified network.

```
const networkName = 'rinkeby';
const deployment = getPayspecContractDeployment(networkName);
console.log(`Deployment for ${networkName}:`, deployment);
```

**getPayspecRandomNonce(size?: number)**: Generates a random nonce to be used in the invoice creation process.

```
const size = 16;
const randomNonce = getPayspecRandomNonce(size);
console.log(`Random nonce:`, randomNonce);

```

**getPayspecInvoiceUUID(invoiceData: PayspecInvoice)**: Calculates the invoice UUID based on the provided invoice data using a SHA3 hash.

```
const invoiceData = {
  payspecContractAddress: '0x...',
  description: 'Invoice for services',
  nonce: '0x...',
  token: '0x...',
  totalAmountDue: '1000000000000000000',
  payToArrayStringified: '["0x..."]',
  amountsDueArrayStringified: '["1000000000000000000"]',
  expiresAt: 1234567890
};

const invoiceUUID = getPayspecInvoiceUUID(invoiceData);
console.log('Invoice UUID:', invoiceUUID);

```

**generateInvoiceUUID(invoiceData: PayspecInvoice)**: Generates an invoice with a UUID.

```
const invoiceWithUUID = generateInvoiceUUID(invoiceData);
console.log('Invoice with UUID:', invoiceWithUUID);
```


**parseStringifiedArray(str: string)**: Parses a stringified array into an actual array.

```
const stringifiedArray = '["0x1234", "0x5678"]';
const parsedArray = parseStringifiedArray(stringifiedArray);
console.log('Parsed array:', parsedArray);
```

**userPayInvoice(from: string, invoiceData**: PayspecInvoice, provider: Web3Provider, netName?: string): Allows a user to pay an invoice

```
onst from = '0x...';
const provider = new Web3Provider(window.ethereum);
const netName = 'mainnet';

userPayInvoice(from, invoiceData, provider, netName)
  .then((result) => {
    if (result.success) {
      console.log('Payment success:', result.data);
    } else {
      console.error('Payment failed:', result.error);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });

```