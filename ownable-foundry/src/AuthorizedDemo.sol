// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "./Ownable.sol";

contract AuthorizedDemo is Ownable {
    uint public ownableModifyNum;

    function specialThing() public override {
        ownableModifyNum++;
    }

    function getOwnableModifyNum() public view returns (uint) {
        return ownableModifyNum;
    }

    function getOwner() public view returns (address) {
        return owner();
    }
}
