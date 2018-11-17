pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";

// Vsc White Token is just VSC token without settings
contract VscWhiteToken is ERC20, ERC20Detailed, ERC20Pausable{
    constructor (
        string name, 
        string symbol, 
        uint8 decimals,
        uint256 totalSupply,
        address owner
        ) ERC20Detailed(name, symbol, decimals) public {
        _mint(owner, totalSupply);
    }
    function superTransferFrom(address from, address to, uint256 value) public onlyPauser returns (bool){
        ERC20._transfer(from, to, value);
        return true;
    }
}

// VSC Token
contract VscToken is VscWhiteToken{
    constructor () VscWhiteToken(
            "Ventures Coin", // name
            "VSC",  // symbol
            18, // decimals
            2000000000 ether, // total supply
            msg.sender // first owner 
        ) 
    public {}
}

