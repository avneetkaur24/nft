const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTMarketplace", function(){
    let deployer, addr1, addr2, nft, marketplace
    let feePercent = 1
    let URI = "Sample URI"

    beforeEach(async function(){
        // get contract factories
        const Collection = await ethers.getContractFactory("Collection");
        const Marketplace = await ethers.getContractFactory("Marketplace");

        //get signers
        [deployer, addr1, addr2] = await ethers.getSigners()

        //deploy contracts
        collection = await Collection.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    describe("Deployment", function(){
        it("Should track name and symbol of the nft collection", async function(){
            expect(await collection.name()).to.equal("My Collection")
            expect(await collection.symbol()).to.equal("MYC")
        })
        it("Should track feeAccount and feePercent of the marketplace", async function(){
            expect(await marketplace.feeAccount()).to.equal(deployer.address)
            expect(await marketplace.feePercent()).to.equal(feePercent)
        })
    });

    describe("Minting NFTs", function(){
         it("Should track each minted NFT", async function (){
            //addr1 mints an nft
            await collection.connect(addr1).mint(URI)
            expect(await collection.tokenCount()).to.equal(1);
            expect(await collection.balanceOf(addr1.address)).to.equal(1);
            expect(await collection.tokenURI(1)).to.equal(URI);

            //addr2 mints an nft
            await collection.connect(addr2).mint(URI)
            expect(await collection.tokenCount()).to.equal(2);
            expect(await collection.balanceOf(addr2.address)).to.equal(1);
            expect(await collection.tokenURI(2)).to.equal(URI);
         })
    });

    describe("Making marketplace items", function(){
        beforeEach(async function(){
            //addr1 mints an nft
            await collection.connect(addr1).mint(URI)

            //addr1 approves marketplace to spend nft
            await collection.connect(addr1).setApprovalForAll(marketplace.address, true)
        })

        it("Should track newly created item, transfer NFT from seller to marketplace and emit offered event", async function(){
            //addr1 offers their nft at va price of 1 ether
            await expect(marketplace.connect(addr1).makeItem(collection.address, 1, toWei(1)))
            .to.emit(marketplace, "Offered")
            .withArgs(1, collection.address, 1, toWei(1), addr1.address)

            //Owner of NFT should now be the marketplace
            expect(await collection.ownerOf(1)).to.equal(marketplace.address)

            //Item count should now equal 1
            expect(await marketplace.itemCount()).to.equal(1)

            //Get item from items mapping then check fields to ensure they are correct
            const item = await marketplace.items(1)
            expect(item.itemId).to.equal(1)
            expect(item.nft).to.equal(collection.address)
            expect(item.tokenId).to.equal(1)
            expect(item.price).to.equal(toWei(1))
            expect(item.sold).to.equal(false)
        })

        it("Should fail if price is set to zero", async function(){
            await expect(
                marketplace.connect(addr1).makeItem(collection.address, 1, 0))
                .to.be.revertedWith("Price must be greater than zero");
            })
    });

    describe("Purchasing marketplace items", function(){
        let price = 2
        beforeEach(async function(){
            //addr1 mints an nft
            await collection.connect(addr1).mint(URI)

            //addr1 approves marketplace to spend nft
            await collection.connect(addr1).setApprovalForAll(marketplace.address, true)

            //addr1 makes their nft a marketplace item
            await marketplace.connect(addr1).makeItem(collection.address, 1, toWei(price))
        })

        it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit Bought event", async function(){
            const sellerInitialEthBal = await addr1.getBalance()
            const feeAccountInitialEthBalance = await deployer.getBalance()

            //fetch items total price (market fees + item price)
            let totalPriceInWei = await marketplace.getTotalPrice(1);

            //addr2 purchases item
            await expect(marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei}))
            .to.emit(marketplace, "Bought")
            .withArgs(
                1,
                collection.address,
                1,
                toWei(price),
                addr1.address,
                addr2.address
            )

            const sellerFinalEthBal = await addr1.getBalance()
            const feeAccountFinalEthBal = await deployer.getBalance()

            //Seller should recieve payment for the price of the NFT sold
            expect(+fromWei(sellerFinalEthBal)).to.equal(+price+ +fromWei(sellerInitialEthBal))

            //Calculate fee
            const fee = (feePercent / 100) * price

            //feeAccount should receive fee
            expect(+fromWei(feeAccountFinalEthBal)).to.equal(+fee+ +fromWei(feeAccountInitialEthBalance))

            //The buyer should now own the nft
            expect(await collection.ownerOf(1)).to.equal(addr2.address);

            //Item should be marked as sold
            expect((await marketplace.items(1)).sold).to.equal(true) 
        })
    });

});