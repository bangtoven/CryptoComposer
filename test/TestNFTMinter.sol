// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "../contracts/CryptoComposerNFTMinter.sol";

contract TestNFTMinter is CryptoComposerNFTMinter {
	function mintNewSong(string calldata title, bytes calldata notes)
		external
		returns (uint256)
	{
		return _mintNewSong(title, notes);
	}
}
