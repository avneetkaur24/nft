const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", deployer.address);
  console.log("Account Balance: ",(await deployer.getBalance()).toString());
  
  const NFT = await hre.ethers.getContractFactory("NFT");
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  //const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  //const Auction = await hre.ethers.getContractFactory("Auction");

  const nft = await NFT.deploy();
  const marketplace = await Marketplace.deploy(1);
  //const myNFT = await MyNFT.deploy();
  //const auction = await Auction.deploy();

  await nft.deployed();
  await marketplace.deployed();
  //await myNFT.deployed();
  //await auction.deployed();

  console.log("NFT deployed to:", nft.address);
  console.log("Marketplace deployed to:", marketplace.address);
  //console.log("MyNFT deployed to:", myNFT.address);
  //console.log("Auction deployed to:", auction.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// NFT deployed to: 0x43aD2983297f3e0d586FAAc795F09676Fa854EF8
