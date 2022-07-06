//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard{
    address payable public immutable feeAccount; // the account that recieves fees
    uint public immutable feePercent; // the fee percentage on sales
    uint public itemCount;
    

    struct Item{
        address payable owner;
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
        uint royaltyInBips;
        bool isPrimarySale;  
    } 

    struct NFTOwners{
        address owner;
        bool isAdded;
    }

    mapping(uint => Item) public items;
    mapping(uint => NFTOwners) public nftOwners;

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent){
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
        
    }

    function makeItem(IERC721 _nft, uint _tokenId, uint _price, uint _royaltyFeesInBips) external nonReentrant {//make order
        require(_price > 0, "Price must be greater than zero");
        itemCount++;
        address _royaltyOwner;
        if(nftOwners[_tokenId].isAdded){
            _royaltyOwner = nftOwners[_tokenId].owner;
        }
        else{
            _royaltyOwner = msg.sender;
            nftOwners[_tokenId].owner = msg.sender;
            nftOwners[_tokenId].isAdded = true;
        }

        //transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        //add new item to items mapping
        items[itemCount] = Item (
            payable(_royaltyOwner),
            itemCount, 
            _nft, 
            _tokenId, 
            _price, 
            payable(msg.sender), 
            false,
            _royaltyFeesInBips,
            false
        );
    
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant{
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
         
        require(_itemId > 0 && _itemId <= itemCount, "item doesnt exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        // require(!item.sold, "item already sold");

        if(!item.isPrimarySale){
            uint royaltyFees = (_totalPrice * item.royaltyInBips) / 100;
            uint amountToPay = _totalPrice - royaltyFees;
            item.isPrimarySale = true;
            item.seller.transfer(amountToPay);
            item.owner.transfer(royaltyFees);
        } else{
            //pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        }
        

        //update item to sold
        item.sold = true;

        //transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.itemId);
    
        //emit bought event
        emit Bought(_itemId, address(item.nft), item.tokenId, item.price, item.seller, msg.sender);
    }

    function getTotalPrice(uint _itemId) public view returns(uint){
        return items[_itemId].price * (100 + feePercent) / 100;
    }

}