
# DegenTx.sol

 The DegenTx smart contract is an atomic and deterministic invoicing system that allows users to generate off-chain invoices based on sell-order data and fulfill those order invoices on-chain.

### Overview

The smart contract utilizes OpenZeppelin's Ownable and ReentrancyGuard contracts for access control and security against re-entrancy attacks. It has a mapping of invoice UUIDs to Invoice structs, which hold the invoice data. The contract provides functions to create and pay invoices, as well as query invoice information.


### Deployments 

[Deployed on Goerli](https://goerli.etherscan.io/address/0x568cD537Ed5C70aE1A2b1B0Fd6DE6D94c7FAdD77)

### Functions

 

**createAndPayInvoice**

Creates and pays an invoice atomically, accepting the required invoice data as parameters. The function requires the correct value to be sent in the transaction if the invoice token is Ether.

```
function createAndPayInvoice(string memory description, uint256 nonce, address token, uint256 totalAmountDue, address[] memory payTo, uint[] memory amountsDue, uint256 ethBlockExpiresAt, bytes32 expecteduuid) public payable nonReentrant returns (bool)
```

**getInvoiceUUID**

Generates an invoice UUID based on the provided invoice data.


```
function getInvoiceUUID(string memory description, uint256 nonce, address token, uint256 totalAmountDue, address[] memory payTo, uint[] memory amountsDue, uint expiresAt) public view returns (bytes32 uuid)
```

**invoiceWasCreated**

Checks if an invoice with the provided UUID was created.

 
```
function invoiceWasCreated(bytes32 invoiceUUID) public view returns (bool)
```

**invoiceWasPaid**

Checks if an invoice with the provided UUID was paid.


```
function invoiceWasPaid(bytes32 invoiceUUID) public view returns (bool)
```

**getInvoiceDescription**

Returns the description of the invoice with the provided UUID.

```
function getInvoiceDescription(bytes32 invoiceUUID) public view returns (string memory)
```

**getInvoiceTokenCurrency**

Returns the token currency of the invoice with the provided UUID.

 
```
function getInvoiceTokenCurrency(bytes32 invoiceUUID) public view returns (address)
```

**getInvoicePayer**

Returns the address of the payer of the invoice with the provided UUID.

 
```
function getInvoicePayer(bytes32 invoiceUUID) public view returns (address)
```

**getInvoiceEthBlockPaidAt**

Returns the Ethereum block number at which the invoice with the provided UUID was paid.

 

```
function getInvoiceEthBlockPaidAt(bytes32 invoiceUUID) public view returns (uint)
```