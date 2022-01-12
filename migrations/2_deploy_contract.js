const CCTVendor = artifacts.require('./CryptoComposerTokenVendor.sol');
const CryptoComposer = artifacts.require('./CryptoComposer.sol');

module.exports = async function (deployer) {
  // Use deployer to state migration tasks.
  await deployer.deploy(CCTVendor);
  const cctInstance = await CCTVendor.deployed();

  await deployer.deploy(CryptoComposer, cctInstance.address);
  const composerInstance = await CryptoComposer.deployed();

  await cctInstance.setCryptoComposerAddress(composerInstance.address);
};
