const { catchRevert } = require('./exceptionsHelpers.js');
// to test internal functions, proxying via inherited contract https://ethereum.stackexchange.com/questions/38158/how-to-unit-test-contract-private-and-internal-functions
const NFTMinter = artifacts.require('TestNFTMinter.sol');

contract('NFTMinter', function (accounts) {
  const [contractOwner, alice] = accounts;

  beforeEach(async () => {
    instance = await NFTMinter.new();
  });

  it('should mint a new song', async () => {
    await instance.mintNewSong('title', []);
  });
});
