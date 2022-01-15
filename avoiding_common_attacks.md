# Contract security measures

## Using Specific Compiler Pragma

Specific compiler pragma `0.8.2` used in contracts to avoid accidental bug inclusion through outdated compiler versions.

## Proper Use of Require, Assert and Revert

- On `_mintNewSong` it requires the hash to be unique to register.
- Require to send enough value to call `buyTokenToMintNFT()`
- Require `tokenVendor.transferFrom()` to success to check payment.

## Use Modifiers Only for Validation

All modifiers in contracts only validate data with `require` statements.
