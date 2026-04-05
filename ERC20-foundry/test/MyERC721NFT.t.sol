// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {MyERC721NFT} from "../src/MyERC721NFT.sol";

contract MyERC721NFTTest is Test {
    MyERC721NFT public myERC721NFT;

    address public notOwner = makeAddr("notOwner");

    function setUp() public {
        myERC721NFT = new MyERC721NFT();
    }

    function testOnlyOwnerCanMint() public {
        myERC721NFT.mint(address(this));
        assertEq(myERC721NFT.ownerOf(0), address(this));
    }

    function testNotOwnerCannotMint() public {
        vm.prank(notOwner);
        vm.expectRevert("Ownable: caller is not the owner");
        myERC721NFT.mint(notOwner);
    }

    function testMint() public {
        myERC721NFT.mint(address(this));
        assertEq(myERC721NFT.ownerOf(0), address(this));
    }

    function testBalanceOf() public {
        myERC721NFT.mint(address(this));
        assertEq(myERC721NFT.balanceOf(address(this)), 1);
    }

    function testGetTokenURI() public {
        myERC721NFT.mint(address(this));
        assertEq(
            myERC721NFT.tokenURI(0),
            string.concat("ipfs://xxx", Strings.toString(0))
        );
    }
}
