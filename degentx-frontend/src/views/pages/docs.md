

## Degen Tx Documentation

 DegenTx is a decentralized crypto payment service built on the Ethereum blockchain that leverages the DegenTx.sol smart contract as its backbone. This service enables users to generate off-chain invoices based on sell-order data and fulfill them on-chain, providing an atomic and deterministic invoicing system.

---
 

### Features

   * Supports payments in Ether (ETH) and ERC20 tokens

   * Generates unique invoice UUIDs to identify and track invoices

   * Prevents double-spending and overwriting of invoices

   * Supports payment expiration based on Ethereum block numbers

   * Implements non-reentrant payment processing to prevent reentrancy attacks


### Getting Started

To get started, log in to the DegenTx Dashboard with your web3 wallet such as Metamask.  There, you can define your "Project" which will be accepting payments and then you can define individual "Products" for that project.

### Payment Invoices

Using the website frontend or Payspec.js, you can create invoices.  An invoice has the following data structure: 


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
  uuid: 0x....
};
 

```

### Access for Payment 

Users can conduct an onchain payment using the 'token' currency of the invoice in the amount of 'totalAmountDue'. When this transaction is finalized by the blockchain network, the smart contract will report that the invoice with that UUID has a status of 'PAID'.

Your service(s) can query the DegenTx HTTP API (or the smart contract directly) for that 'PAID' status in order to grant access to digital or physical content for anything that you decide to link to that particular invoice UUID. 

