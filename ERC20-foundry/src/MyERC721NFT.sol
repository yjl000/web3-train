// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "./Ownable.sol";

contract MyERC721NFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("MyERC721NFT", "MNFT") {}

    function mint(address to) public onlyOwner {
        require(to != address(0), "ERC721: mint to the zero address");
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        ownerOf(tokenId);
        return string.concat("ipfs://xxx", Strings.toString(tokenId));
    }
}
