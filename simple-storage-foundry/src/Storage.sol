// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Storage {
    uint256 private number;

    function setNumber(uint256 _number) external {
        number = _number;
    }

    function getNumber() public view returns (uint256) {
        return number;
    }
}
