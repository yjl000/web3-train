// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Storage} from "../src/Storage.sol";

contract StorageTest is Test {
    Storage public storageSimple;

    function setUp() public {
        storageSimple = new Storage();
    }

    function testSetAndGetNumber() public {
        storageSimple.setNumber(100);
        assertEq(storageSimple.getNumber(), 100);
    }
}
