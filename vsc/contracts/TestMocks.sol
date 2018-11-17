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