// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


import "forge-std/Test.sol";

import "../contracts/DegenTx.sol";

 
import {FixedSupplyToken} from "../contracts/mock/FixedSupplyToken.sol";

import "lib/forge-std/src/console.sol";


contract DegenTxTest is Test {
     
    DegenTx degenTx;
    FixedSupplyToken xToken;

    MockUser fRecipient;

    uint256 startBlockNumber = 1000;

    function setUp() public {

        vm.roll(startBlockNumber);

        fRecipient = new MockUser();
        xToken = new FixedSupplyToken();

        degenTx = new DegenTx();

 

    }

    function test_createAndPayInvoice() public {
     
   
 
    }

 
}

 

contract MockUser {}