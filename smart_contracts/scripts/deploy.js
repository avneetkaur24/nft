const hre = require("hardhat");

async function main() {
  
  const Collection = await hre.ethers.getContractFactory("Collection");
  const collection = await Collection.deploy();

  await collection.deployed();

  console.log("Collection deployed to:", collection.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
