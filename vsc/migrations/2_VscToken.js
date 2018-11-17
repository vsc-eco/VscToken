var VscToken = artifacts.require("VscToken");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(
      VscToken
    );
};