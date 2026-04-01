// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {Storage} from "../src/Storage.sol";

contract DeploayStorage is Script {
    Storage public storageSimple;

    function run() external {
        vm.startBroadcast();
        storageSimple = new Storage();
        vm.stopBroadcast();
    }
}
