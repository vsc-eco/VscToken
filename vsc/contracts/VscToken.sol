pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";


contract VscToken is ERC20, ERC20Detailed{
    constructor (
        string name, 
        string symbol, 
        uint8 decimals,
        uint256 totalSupply
        ) ERC20Detailed(name, symbol, decimals) public {
        _mint(msg.sender, totalSupply);
    }
}
