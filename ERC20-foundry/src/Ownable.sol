// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Ownable {
    address public _owner;

    constructor() {
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }

    function specialThing() public virtual onlyOwner {
        // Implementation for the special thing that only the owner can do
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        require(
            _newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _owner = _newOwner;
    }

    function renounceOwnership() public onlyOwner {
        _owner = address(0);
    }

    function owner() public view returns (address) {
        return _owner;
    }
}
