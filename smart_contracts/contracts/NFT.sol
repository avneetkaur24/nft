//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// contract Collection is ERC721URIStorage, Ownable {
//     uint256 tokenId = 0;

//     constructor() ERC721('My Collection', 'MYC') {}

//     function mint(string memory uri) public onlyOwner {
//         _mint(msg.sender, tokenId);
//         _setTokenURI(tokenId, uri);
//         tokenId++;
//     }
// }

contract NFT is ERC721URIStorage{
    uint public tokenCount;
    
    constructor() ERC721('My NFT', 'MNFT') {}

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }

}