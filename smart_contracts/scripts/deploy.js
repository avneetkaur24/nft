const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", deployer.address);
  console.log("Account Balance: ",(await deployer.getBalance()).toString());
  
  //const Collection = await hre.ethers.getContractFactory("Collection");
  //const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");

  //const collection = await Collection.deploy();
  //const myNFT = await MyNFT.deploy();
  const marketplace = await Marketplace.deploy(1);

  //await collection.deployed();
  //await myNFT.deployed();
  await marketplace.deployed();

  // console.log("Collection deployed to:", collection.address);
  //console.log("MyNFT deployed to:", myNFT.address);
  console.log("Marketplace deployed to:", marketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  // MyNFT deployed to: 0x56b59bD2A6e79e9858a612970c5A1e900b2e90AC
  // Marketplace deployed to: 0x14109BD4F03380788485ab6cE32BEb90e4b595bF