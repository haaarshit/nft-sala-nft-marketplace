// SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTSala is ERC721URIStorage {
    // library
    using Counters for Counters.Counter;
    // states
    address payable private owner;
    uint256 _listPrice = 0.01 ether;
    Counters.Counter private _tokenId;
    Counters.Counter private _itemSold;

    // custom data type
    struct ListedToken {
        uint256 tokenId;
        address payable _ownerOf;
        address payable _seller;
        uint256 _price;
        bool _isListed;
    }

    mapping(uint256 => ListedToken) idToListedToken;

    // constructor
    constructor() ERC721("NFTSala", "NFTM") {
        owner = payable(msg.sender);
    }

    // modifiers
    modifier isOwner() {
        require(owner == msg.sender, "Only owner can update the listPrice");
        _;
    }

    // functions
    // price update
    function updateListPrice(uint256 price) public payable isOwner {
        _listPrice = price;
    }

    function createToken(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint256) {
        require(msg.value == _listPrice, "Did not send enough");
        require(price > 0, "Price should be greater than 0");
        _tokenId.increment();
        uint256 currentTokenid = _tokenId.current();
        _safeMint(msg.sender, currentTokenid);
        _setTokenURI(currentTokenid, tokenURI);
        createListedTokenId(currentTokenid, price);
        return currentTokenid;
    }

    function createListedTokenId(uint256 tokenId, uint256 price) private {
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(address(msg.sender)),
            price,
            true
        );
        // transfer ownership of this particular nft to this smart contract
        // contract has right to tranfer it
        _transfer(msg.sender, address(this), tokenId);
    }

    function executeSale(uint256 tokenId) public payable {
        uint price = idToListedToken[tokenId]._price;
        require(
            msg.value == price,
            "Value is not equal to price of NFT in order to perchase it"
        );
        address seller = idToListedToken[tokenId]._seller;
        idToListedToken[tokenId]._isListed = true;
        idToListedToken[tokenId]._seller = payable(msg.sender);
        _itemSold.increment();
        // transfer nft from this contract to sender(user who make this transaction)
        _transfer(address(this), msg.sender, tokenId);
        idToListedToken[tokenId]._ownerOf = payable(msg.sender);
        // tranfer list price to the owner of the smart contract
        payable(owner).transfer(_listPrice);
        // transfer the price value of NFT to seller
        payable(seller).transfer(msg.value);
    }

    // getter functions
    function getListPrice() public view returns (uint256) {
        return _listPrice;
    }

    function getLatestListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenId.current();
        return idToListedToken[currentTokenId];
    }

    function getTokenFromId(
        uint256 tokenId
    ) public view returns (ListedToken memory) {
        require(tokenId <= _tokenId.current());
        return idToListedToken[tokenId];
    }

    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenId.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            uint currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex = currentIndex + 1;
        }
        return tokens;
    }

    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint itemsCount = _tokenId.current();
        uint myItems = 0;
        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToListedToken[i + 1]._ownerOf == msg.sender ||
                idToListedToken[i + 1]._seller == msg.sender
            ) {
                myItems = myItems + 1;
            }
        }
        ListedToken[] memory tokens = new ListedToken[](myItems);
        uint curretIndex = 0;
        for (uint i = 0; i < itemsCount; i++) {
            if (
                idToListedToken[i + 1]._ownerOf == msg.sender ||
                idToListedToken[i + 1]._seller == msg.sender
            ) {
                ListedToken storage token = idToListedToken[i + 1];
                tokens[curretIndex] = token;
                curretIndex = curretIndex + 1;
            }
        }
        return tokens;
    }
}
