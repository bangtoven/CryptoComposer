// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CopyrightsShareholder {
  struct Content {
    string name;
    mapping (address => unit) shares;
  }

  mapping (uint => Content) contents;

  uint contentsCount;

  constructor() public {
  }

  function mintSomething(string name, uint tokenCount) public payable {
    
  }

  modifier isShareholder(uint contentId, address addr) {
    Content memory content = contents[contentId];
    require(content.shares[addr] > 0);
    _;
  }

  function grantShare(uint contentId, address recipient, uint share) public payable 
    isShareholder(contentId, msg.sender)
  {

  }


}
