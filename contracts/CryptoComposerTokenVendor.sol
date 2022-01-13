// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./CryptoComposerToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoComposerTokenVendor is CryptoComposerToken, Ownable {
	event CCTBought(address indexed by, uint256 amount);

	uint256 public tokenPrice = 10**(18 - 3); // 0.001 ETH

	function setTokenPrice(uint256 _newPrice) external onlyOwner {
		tokenPrice = _newPrice;
	}

	address public cryptoComposerAddress;

	function setCryptoComposerAddress(address _addr) external onlyOwner {
		cryptoComposerAddress = _addr;
		_grantRole(MINTER_ROLE, _addr);
	}

	function buyTokenToMintNFT()
		external
		payable
		returns (uint256 tokenAmount)
	{
		uint256 amountToBuy = msg.value / tokenPrice;
		require(amountToBuy > 0, "Send ETH to buy some tokens");

		require(cryptoComposerAddress != address(0));

		_mint(msg.sender, amountToBuy);
		increaseAllowance(cryptoComposerAddress, amountToBuy);

		emit CCTBought(msg.sender, amountToBuy);

		return amountToBuy;
	}
}
