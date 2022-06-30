// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";

contract MyNFT is ERC721A{
    string public baseURI = "https://gateway.pinata.cloud/ipfs/QmdpU4sxRB1ap12BQYdpJwxNAXCsMMFoSsB3PwYj9TNcWd/";
    constructor() ERC721A("MyNFT", "MNFT") {}

    function mint(uint256 quantity) external payable {
        // _safeMint's second argument now takes in a quantity, not a tokenId.
        _safeMint(msg.sender, quantity);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

}
