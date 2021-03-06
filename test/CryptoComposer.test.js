const { catchRevert } = require('./exceptionsHelpers.js');
const TokenVendor = artifacts.require('./CryptoComposerTokenVendor.sol');
const CryptoComposer = artifacts.require('./CryptoComposer.sol');

contract('CryptoComposer', function (accounts) {
  const [contractOwner, alice] = accounts;
  const originalTokenPrice = 1000000000000000;

  beforeEach(async () => {
    tokenInstance = await TokenVendor.new();
    composerInstance = await CryptoComposer.new(tokenInstance.address);
    await tokenInstance.setCryptoComposerAddress(composerInstance.address);
  });

  it('should not allow minting without enough CCT', async () => {
    await catchRevert(composerInstance.mintNewSong('new_song_title', web3.utils.asciiToHex('notes_data')));
  });

  it('should allow minting with enough CCT', async () => {
    const numberOfTokensToBuy = 5;
    await tokenInstance.buyTokenToMintNFT({ from: alice, value: numberOfTokensToBuy * originalTokenPrice });

    var balance = await tokenInstance.balanceOf(alice);
    assert.equal(balance.toNumber(), numberOfTokensToBuy);

    const contractInitialBalance = (await tokenInstance.balanceOf(composerInstance.address)).toNumber();

    // mint
    await composerInstance.mintNewSong('new_song_title', web3.utils.asciiToHex('notes_data'), { from: alice });
    const minted = await composerInstance.songs(0);
    assert.equal(minted.composer, alice);
    assert.equal(minted.title, 'new_song_title');
    assert.equal(minted.notes, web3.utils.asciiToHex('notes_data'));

    balance = await tokenInstance.balanceOf(alice);
    assert.equal(balance.toNumber(), numberOfTokensToBuy - 1, 'token should be spent');

    contractBalance = await tokenInstance.balanceOf(composerInstance.address);
    assert.equal(contractBalance.toNumber(), contractInitialBalance + 1, 'token should be transferred to contract');
  });
});
