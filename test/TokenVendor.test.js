const { catchRevert } = require('./exceptionsHelpers.js');
const Token = artifacts.require('./CryptoComposerToken.sol');
const TokenVendor = artifacts.require('./CryptoComposerTokenVendor.sol');

contract('TokenVendor', function (accounts) {
  const [contractOwner, alice] = accounts;
  const originalTokenPrice = 100000000000000;

  beforeEach(async () => {
    tokenInstance = await Token.new();
    instance = await TokenVendor.new(tokenInstance.address);
  });

  it('should allow only owner to call setTokenPrice', async () => {
    var tokenPrice = await instance.tokenPrice();
    assert.equal(tokenPrice.toNumber(), originalTokenPrice);

    const newTokenPrice = 777;
    await instance.setTokenPrice(newTokenPrice, { from: contractOwner });
    tokenPrice = await instance.tokenPrice();
    assert.equal(tokenPrice.toNumber(), web3.utils.toBN(newTokenPrice));
  });

  it('should not allow non-owner to call setTokenPrice', async () => {
    await catchRevert(instance.setTokenPrice(999999, { from: alice }));
    const tokenPrice = await instance.tokenPrice();
    assert.equal(tokenPrice.toNumber(), originalTokenPrice);
  });
});
