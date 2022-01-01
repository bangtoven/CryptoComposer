const CCT = artifacts.require('./CryptoComposerToken.sol');
const CryptoComposer = artifacts.require('./CryptoComposer.sol');

module.exports = async function (deployer) {
  // Use deployer to state migration tasks.
  await deployer.deploy(CCT);
  const cctInstance = await CCT.deployed();

  await deployer.deploy(CryptoComposer, cctInstance.address);
  const composerInstance = await CryptoComposer.deployed();

  const minterRole = await cctInstance.MINTER_ROLE();
  await cctInstance.grantRole(minterRole, composerInstance.address);
};
