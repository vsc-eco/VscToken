pragma solidity ^0.4.24;

import "./VscToken.sol";

contract ERC20Mock is VscWhiteToken {
    constructor(address owner, uint256 totalSupply) VscWhiteToken(
        "MockVSC ERC20",
        "VSC",
        18,
        totalSupply,
        owner
    ) public
    {}

  function mint(address account, uint256 amount) public {
    _mint(account, amount);
  }

  function burn(address account, uint256 amount) public {
    _burn(account, amount);
  }

  function burnFrom(address account, uint256 amount) public {
    _burnFrom(account, amount);
  }

}

contract ERC20PausableMock is VscWhiteToken{
    constructor(address owner, uint256 totalSupply) VscWhiteToken(
        "MockVSC ERC20",
        "VSC",
        18,
        totalSupply,
        owner
    ) public
    {}
    // this is just to remove some errors from public role test, since
    // we do not support removePauser function

    function onlyPauserMock() public view onlyPauser {
    }

    function removePauser(address account) public {
        _removePauser(account);
    }

    // Causes a compilation error if super._removePauser is not internal
    function _removePauser(address account) internal {
        super._removePauser(account);
    }
}

contract ERC20DetailedMock is VscWhiteToken {
  constructor(
    string name,
    string symbol,
    uint8 decimals
  )
  VscWhiteToken(name, symbol, decimals, 200, msg.sender)
    public
  {}
}