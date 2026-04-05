// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MyToken} from "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public myToken;

    address public otherUser = makeAddr("otherUser");
    address public targetUser = makeAddr("targetUser");

    function setUp() public {
        myToken = new MyToken();
    }

    function testInitialSupply() public {
        assertEq(myToken.totalSupply(), 0 * 10 ** 18);
    }

    function testOwnerCanMint() public {
        myToken.mint(address(this), 100 * 10 ** 18);
        assertEq(myToken.totalSupply(), 100 * 10 ** 18);
        assertEq(myToken.balanceOf(address(this)), 100 * 10 ** 18);
    }

    function testOnlyOwnerCanMint() public {
        vm.prank(otherUser);
        vm.expectRevert("Ownable: caller is not the owner");
        myToken.mint(otherUser, 100 * 10 ** 18);
    }

    function testTransfer() public {
        myToken.mint(address(this), 100 * 10 ** 18);
        myToken.transfer(targetUser, 50 * 10 ** 18);
        assertEq(myToken.balanceOf(address(this)), 50 * 10 ** 18);
        assertEq(myToken.balanceOf(targetUser), 50 * 10 ** 18);
    }

    function testTransferFrom() public {
        myToken.mint(address(this), 100 * 10 ** 18);
        myToken.transfer(otherUser, 50 * 10 ** 18);
        vm.prank(otherUser);
        myToken.approve(address(this), 25 * 10 ** 18);
        myToken.transferFrom(otherUser, targetUser, 25 * 10 ** 18);
        assertEq(myToken.balanceOf(address(this)), 50 * 10 ** 18);
        assertEq(myToken.balanceOf(otherUser), 25 * 10 ** 18);
        assertEq(myToken.balanceOf(targetUser), 25 * 10 ** 18);
    }

    function testTotalSupply() public {
        myToken.mint(address(this), 100 * 10 ** 18);
        assertEq(myToken.totalSupply(), 100 * 10 ** 18);
    }
}
