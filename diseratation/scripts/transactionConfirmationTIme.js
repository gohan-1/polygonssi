const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy the DidRegistry contract
  const DidRegistry = await ethers.getContractFactory("DidRegistry");
  const didRegistry = await DidRegistry.deploy();

  console.log("DidRegistry deployed to:", didRegistry.address);

  // Record the time when the transaction is sent
  const txCreateDID = await didRegistry.createDID(
    deployer.address,
    "Sample DID Document",
  );

  const submissionTime = new Date().getTime(); // Time of transaction submission

  console.log("Transaction submitted at:", submissionTime);

  // Wait for the transaction to be mined and confirmed
  const receipt = await txCreateDID.wait();

  const confirmationTime = new Date().getTime(); // Time when transaction is confirmed

  console.log("Transaction confirmed at:", confirmationTime);

  // Calculate confirmation time in seconds
  const confirmationDuration = (confirmationTime - submissionTime) / 1000;

  console.log(`Transaction Confirmation Time: ${confirmationDuration} seconds`);

  // Now you can interact with the contract to retrieve the created DID
  const didDoc = await didRegistry.getDID(deployer.address);
  console.log("DID Document retrieved:", didDoc);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
