const UtilityBills = artifacts.require("UtilityBills");

module.exports = function (deployer) {
  deployer.deploy(UtilityBills);
};
