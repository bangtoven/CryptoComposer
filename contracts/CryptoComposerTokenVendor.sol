// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./CryptoComposerToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Crypto Composer Token Vendor
/// @author Jungho Bang
/// @notice Manages supply and price of underlying CCT
contract CryptoComposerTokenVendor is CryptoComposerToken, Ownable {
	/// @notice Event emitted when user buys CCT
	/// @param by Address of user
	/// @param amount Amountn of CCT
	event CCTBought(address indexed by, uint256 amount);

	uint256 public tokenPrice = 10**(18 - 3); // 0.001 ETH

	/// @notice Update price of CCT
	/// @param _newPrice in ETH
	function setTokenPrice(uint256 _newPrice) external onlyOwner {
		tokenPrice = _newPrice;
	}

	address public cryptoComposerAddress;

	/// @notice Allow CryptoComposer to receive CCT from users
	/// @param _addr address of CryptoComposer contract
	function setCryptoComposerAddress(address _addr) external onlyOwner {
		cryptoComposerAddress = _addr;
		_grantRole(MINTER_ROLE, _addr);
	}

	/// @notice Buy CCT
	/// @return tokenAmount The amount minted and transferred to sender
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

	/// @notice Withdraw whole balance and transfer it to the owner
	function withdrawAll() external onlyOwner {
		payable(owner()).transfer(address(this).balance);
	}
}
