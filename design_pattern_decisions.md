# Design Pattern Decisions

## Inter-Contract Execution

- `CryptoComposer` calls `CryptoComposerTokenVendor` to get allowance of user to check whether they have enough balance and to transfer CCT from user to itself.

## Inheritance and Interfaces

- `CryptoComposer` inherits `CryptoComposerNFTMinter`, which also inherits openzeppelin's ERC721.sol
- `CryptoComposerTokenVendor` also defines additional features on top of `CryptoComposerToken` which uses openzeppelin's ERC20.sol

```
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
```

## Access Control Design Patterns

- `CryptoComposerToken` is `AccessControl` to grant `MINTER_ROLE` to `CryptoComposer`
- `CryptoComposerTokenVendor` is `Ownable` to allow only owner to set token price.
- `CryptoComposerNFTMinter` is `Ownable` to allow only owner to metadata base url.
