// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./CryptoComposerTokenVendor.sol";
import "./CryptoComposerNFTMinter.sol";

/// @title Contract to mint music NFT and distribute CCT
/// @author Jungho Bang
/// @notice Allows users to mint their song, accepting CCT as payment
contract CryptoComposer is CryptoComposerNFTMinter {
	CryptoComposerTokenVendor tokenVendor;

	constructor(address cctAddress) {
		tokenVendor = CryptoComposerTokenVendor(cctAddress);
	}

	uint256 public tokenPerMinting = 1;

	modifier hasEnoughComposerToken() {
		uint256 allowance = tokenVendor.allowance(msg.sender, address(this));
		require(allowance >= tokenPerMinting, "Check the token allowance");
		_;
	}

	function mintNewSong(string calldata title, bytes calldata notes)
		external
		hasEnoughComposerToken
		returns (uint256)
	{
		bool sent = tokenVendor.transferFrom(
			msg.sender,
			address(this),
			tokenPerMinting
		);
		require(sent, "Failed to pay token to contract");

		return _mintNewSong(title, notes);
	}
}
