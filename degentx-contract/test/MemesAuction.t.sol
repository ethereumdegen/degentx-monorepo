// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


import "forge-std/Test.sol";

import "../contracts/MemesAuction.sol";


import {IMintableNFT} from "../contracts/interfaces/IMintableNFT.sol";
import {_0xMockToken} from "../contracts/mock/_0xMockToken.sol";

import "lib/forge-std/src/console.sol";


contract MemesAuctionTest is Test {
    MemesAuction mAuction;
    _0xMockToken xToken;

    MockUser fRecipient;

    uint256 startBlockNumber = 1000;

    function setUp() public {

        vm.roll(startBlockNumber);

        fRecipient = new MockUser();
        xToken = new _0xMockToken();

        mAuction = new MemesAuction(address(new MockJpegsNft()),address(xToken));


        xToken.mint(0,0x0);
        xToken.mint(0,0x0);
        xToken.mint(0,0x0);
        xToken.mint(0,0x0);

    }

    function test_getMintPrice() public {
     
        mAuction.startAuction();

        uint256 mintPrice = mAuction.getMintPrice(startBlockNumber + 1);
       
        assertEq(
             mAuction.getMintPrice(startBlockNumber + 1),
             2100000000000000,
             "unexpected mint price after 1 block"

        );

        assertEq(
             mAuction.getMintPrice(startBlockNumber + 10),
             2100000000000000,
             "unexpected mint price after 10 blocks"

        );

 
        assertEq(
             mAuction.getMintPrice(startBlockNumber + 1000),
             4199_16016797,
             "unexpected mint price after few hours"

        );  

        //after one day
        assertEq(
             mAuction.getMintPrice(startBlockNumber + 7000),
             85_71393587,
             "unexpected mint price after one day"
        );

        assertEq(
             mAuction.getMintPrice(startBlockNumber + 14000),
             21_42854957,
             "unexpected mint price after two days"
        );

        assertEq(
             mAuction.getMintPrice(startBlockNumber + 21000),
             9_52380521,
             "unexpected mint price after three days"
        );

        assertEq(
             mAuction.getMintPrice(startBlockNumber + 28000),
             5_35714150,
             "unexpected mint price after four days"
        );
 
    }


    function test_buyout() public { 
        
          xToken.mint(0,0x0);
          mAuction.startAuction(); 

          mAuction.setFundsRecipient(address(fRecipient));

          vm.roll(startBlockNumber + 500000);

          bytes memory data;

          uint256 amount = mAuction.getMintPrice(block.number);

          uint256 balance = xToken.balanceOf(  address(this) ); 

          xToken.approve( address(mAuction), amount ); 

          mAuction.buyout( 5000000, address(this)  );


           assertEq(
             xToken.balanceOf(address(fRecipient)),
             amount/2,
             "unexpected balance"
          );

           assertEq(
             xToken.balanceOf(address(0)),
             amount/2,
             "unexpected balance"
          );
    }

     function test_buyout_2() public { 
        
          xToken.mint(0,0x0);
          mAuction.startAuction(); 

          vm.roll(startBlockNumber + 500000);

          bytes memory data;

          uint256 amount = mAuction.getMintPrice(block.number);

          uint256 balance = xToken.balanceOf(  address(this) ); 

          xToken.approveAndCall( address(mAuction), amount, data ); 

    }
}


contract MockJpegsNft is IMintableNFT {


    function mint(address to ) external returns (uint256 tokenId)
    {
     return 0 ;
    }


    function hasMintableNft() external returns (bool){
     return true;
    }


}

contract MockUser {}