// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {AuthorizedDemo} from "../src/AuthorizedDemo.sol";

contract AuthorizedDemoTest is Test {
    AuthorizedDemo public authorizedDemo;

    function setUp() public {
        authorizedDemo = new AuthorizedDemo();
    }

    function testDeployerIsOwnable() public {
        console.log("call current function address:", msg.sender);
        console.log("this contract address:", address(this));
        assertEq(address(this), authorizedDemo.getOwner());
    }

    function testOnlyOwnerCanCallSpecialThing() public {
        vm.prank(authorizedDemo.getOwner());
        authorizedDemo.specialThing();
    }

    function testNotOwnerCannotCallSpecialThing() public {
        vm.prank(address(0x123));
        vm.expectRevert("Ownable: caller is not the owner");
        authorizedDemo.specialThing();
    }

    function testTransferOwnership() public {
        address newOwner = makeAddr("newOwner");
        authorizedDemo.transferOwnership(newOwner);
        assertEq(authorizedDemo.getOwner(), newOwner);
    }
}
