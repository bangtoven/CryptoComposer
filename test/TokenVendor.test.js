const { catchRevert } = require('./exceptionsHelpers.js');
const TokenVendor = artifacts.require('./CryptoComposerTokenVendor.sol');

contract('TokenVendor', function (accounts) {
  const [contractOwner, alice] = accounts;
  const originalTokenPrice = 1000000000000000;

  beforeEach(async () => {
    vendorInstance = await TokenVendor.new();
    await vendorInstance.setCryptoComposerAddress(vendorInstance.address);
  });

  context('token price', async () => {
    it('should allow only owner to call setTokenPrice', async () => {
      var tokenPrice = await vendorInstance.tokenPrice();
      assert.equal(tokenPrice.toNumber(), originalTokenPrice);

      const newTokenPrice = 777;
      await vendorInstance.setTokenPrice(newTokenPrice, { from: contractOwner });
      tokenPrice = await vendorInstance.tokenPrice();
      assert.equal(tokenPrice.toNumber(), web3.utils.toBN(newTokenPrice));
    });

    it('should not allow non-owner to call setTokenPrice', async () => {
      await catchRevert(vendorInstance.setTokenPrice(999999, { from: alice }));
      const tokenPrice = await vendorInstance.tokenPrice();
      assert.equal(tokenPrice.toNumber(), originalTokenPrice);
    });
  });

  context('buy token', async () => {
    it('should revert without enough fund', async () => {
      var balance = await vendorInstance.balanceOf(alice);
      assert.equal(balance.toNumber(), 0);

      await catchRevert(vendorInstance.buyTokenToMintNFT({ from: alice, value: 0 }));
      balance = await vendorInstance.balanceOf(alice);
      assert.equal(balance.toNumber(), 0, 'CCT balance should be zero');
    });

    it('should transfer CCT to sender with enough fund', async () => {
      var balance = await vendorInstance.balanceOf(alice);
      assert.equal(balance.toNumber(), 0);

      const numberOfTokensToBuy = 7;
      await vendorInstance.buyTokenToMintNFT({ from: alice, value: numberOfTokensToBuy * originalTokenPrice });
      balance = await vendorInstance.balanceOf(alice);
      assert.equal(balance.toNumber(), numberOfTokensToBuy);

      const totalSupply = await vendorInstance.totalSupply();
      assert.equal(totalSupply.toNumber(), numberOfTokensToBuy);
    });

    // it('should mint additional CCT when vendor does not have enough', async () => {
    //   var totalSupply = await vendorInstance.totalSupply();
    //   assert.equal(totalSupply.toNumber(), 0);

    //   const numberOfTokensToBuy = 200;
    //   await vendorInstance.buyToken({ from: alice, value: numberOfTokensToBuy * originalTokenPrice });

    //   totalSupply = await vendorInstance.totalSupply();
    //   assert.equal(totalSupply.toNumber(), 1000, 'total should be increased by default amount');

    //   var vendorBalance = await vendorInstance.balanceOf(vendorInstance.address);
    //   assert.equal(vendorBalance.toNumber(), 1000 - numberOfTokensToBuy);
    // });

    it('should mint necessary amount', async () => {
      var totalSupply = await vendorInstance.totalSupply();
      assert.equal(totalSupply.toNumber(), 0);

      const numberOfTokensToBuy = 3000;
      await vendorInstance.buyTokenToMintNFT({ from: alice, value: numberOfTokensToBuy * originalTokenPrice });

      totalSupply = await vendorInstance.totalSupply();
      assert.equal(totalSupply.toNumber(), 3000, 'total should be increased to cover new purchase');

      var vendorBalance = await vendorInstance.balanceOf(vendorInstance.address);
      assert.equal(vendorBalance.toNumber(), 0);
    });
  });
});
