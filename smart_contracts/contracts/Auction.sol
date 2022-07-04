//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

// interface IERC721{
//     function transfer(address, uint) external;
//     function transferFrom(address, address, uint) external;
// }

// contract Auction{
//     address payable public seller;

//     bool public started;
//     bool public ended;
//     uint public endAt;

//     IERC721 public nft;
//     uint public nftId;

//     uint public highestBid;
//     address public highestBidder;
//     mapping(address => uint) public bids;

//     event Start();
//     event End(address highestBidder, uint highestBid);
//     event Bid(address indexed sender, uint amount);
//     event Withdraw(address indexed bidder, uint amount);

//     constructor(){
//         seller = payable(msg.sender);
//     }

//     function start(uint _nftId, uint startingBid) external {
//         require(!started, "Already started");
//         require(msg.sender == seller, "You did not start the auction");
        
//         highestBid = startingBid;

//         //nft = _nft;
//         nftId = _nftId;

//         started = true;
//         endAt = block.timestamp + 2 days;
//         nft.transferFrom(msg.sender, address(this), nftId);
//         emit Start();
//     }

//     function bid() external payable{
//         require(started, "Not started");
//         require(block.timestamp < endAt, "Ended!");
//         require(msg.value > highestBid);

//         if(highestBidder != address(0)){
//             bids[highestBidder] += highestBid;
//         }

//         highestBid = msg.value;
//         highestBidder = msg.sender;

//         emit Bid(highestBidder, highestBid);

//     }

//     function withdraw() external payable{
//         uint bal = bids[msg.sender];
//         bids[msg.sender] = 0;
//         (bool sent, bytes memory data) = payable(msg.sender).call{value: bal}(" ");
//         require(sent, "Could not withdraw");

//         emit Withdraw(msg.sender, bal);
//     }

//     function end(uint _nftId) external {
//         nftId = _nftId;
//         require(started, "You need to start first!");
//         require(block.timestamp >= endAt, "Auction is still going on");
//         require(!ended, "Auction already ended");

//         if(highestBidder != address(0)){
//             nft.transfer(highestBidder, nftId);
//             (bool sent, bytes memory data) = seller.call{value: highestBid}(" ");
//         require(sent, "Could not pay seller");
//         } else {
//             nft.transfer(seller, nftId);
//         }

//         ended = true;
//         emit End(highestBidder, highestBid);
//     }

// }