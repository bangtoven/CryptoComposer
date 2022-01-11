// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./CryptoComposerToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract CryptoComposerTokenVendor is Ownable {
	CryptoComposerToken ccToken;

	constructor(address cctAddress) {
		ccToken = CryptoComposerToken(cctAddress);
	}

	uint256 public tokenPrice = 10**(18 - 3); // 0.001 ETH

	function setTokenPrice(uint256 _newPrice) public onlyOwner {
		tokenPrice = _newPrice;
	}

	function buyToken() public payable returns (uint256 tokenAmount) {
		uint256 amountToBuy = msg.value / tokenPrice;
		require(amountToBuy > 0, "Send ETH to buy some tokens");

		// check if the Vendor Contract has enough amount of tokens for the transaction
		uint256 vendorBalance = ccToken.balanceOf(address(this));
		if (vendorBalance < amountToBuy) {
			ccToken.mint(address(this), Math.max(1000, amountToBuy));
		}

		// Transfer token to the msg.sender
		bool sent = ccToken.transfer(msg.sender, amountToBuy);
		require(sent, "Failed to transfer token to user");

		return amountToBuy;
	}
}
