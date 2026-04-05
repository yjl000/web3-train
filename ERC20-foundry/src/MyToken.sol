// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Ownable} from "./Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyFirstToken", "MFT") {}

    function mint(address _to, uint256 amount) public onlyOwner {
        require(_to != address(0), "ERC20: mint to the zero address");
        _mint(_to, amount);
    }
}
