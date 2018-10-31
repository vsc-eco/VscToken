var VscToken = artifacts.require("VscToken");

const TWO_BILLION_IN_WEI = '2000000000'+'000000000000000000'

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(
      VscToken,
      "Ventures Coin",
      "VSC",
      18,
      TWO_BILLION_IN_WEI
    );
};