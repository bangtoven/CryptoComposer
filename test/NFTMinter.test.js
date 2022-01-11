const { catchRevert } = require('./exceptionsHelpers.js');
// to test internal functions, proxying via inherited contract https://ethereum.stackexchange.com/questions/38158/how-to-unit-test-contract-private-and-internal-functions
const NFTMinter = artifacts.require('TestNFTMinter.sol');

contract('NFTMinter', function (accounts) {
  const [contractOwner, alice] = accounts;

  beforeEach(async () => {
    instance = await NFTMinter.new();
  });

  it('should mint a new song', async () => {
    var totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.toNumber(), 0);

    await instance.mintNewSong('new_song_title', web3.utils.asciiToHex('notes_data'), { from: alice });

    totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.toNumber(), 1, 'total supply should be increased');

    const minted = await instance.songs(0);
    assert.equal(minted.composer, alice);
    assert.equal(minted.title, 'new_song_title');
    assert.equal(minted.notes, web3.utils.asciiToHex('notes_data'));
  });

  it('should not allow minting another song with same notes', async () => {
    await instance.mintNewSong('song_title', web3.utils.asciiToHex('notes_data'), { from: contractOwner });

    var totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.toNumber(), 1);

    // expect error
    await catchRevert(instance.mintNewSong('another_title', web3.utils.asciiToHex('notes_data'), { from: alice }));

    totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.toNumber(), 1, 'total supply should not change');
  });
});
