const { catchRevert } = require('./exceptionsHelpers.js');
const Token = artifacts.require('./CryptoComposerToken.sol');
const CryptoComposer = artifacts.require('./CryptoComposer.sol');

contract('CryptoComposer', function (accounts) {
  const [contractOwner, alice] = accounts;
  const originalTokenPrice = 1000000000000000;

  beforeEach(async () => {
    tokenInstance = await Token.new();
    composerInstance = await CryptoComposer.new(tokenInstance.address);
    const minterRole = await tokenInstance.MINTER_ROLE();
    await tokenInstance.grantRole(minterRole, composerInstance.address);
  });

  it('should not allow minting without enough CCT', async () => {
    await catchRevert(composerInstance.mintNewSong('new_song_title', web3.utils.asciiToHex('notes_data')));
  });

  it('should allow minting with enough CCT', async () => {
    const numberOfTokensToBuy = 5;
    await composerInstance.buyToken({ from: alice, value: numberOfTokensToBuy * originalTokenPrice });

    await tokenInstance.increaseAllowance(composerInstance.address, 1, { from: alice });

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
