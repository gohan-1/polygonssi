const { ethers } = require("hardhat");

async function main() {
  // Get the deployer's wallet
  const [deployer] = await ethers.getSigners();

  // Use ethers.utils.parseEther to convert Ether to Wei
  const valueToSend = ethers.parseEther("0.01");

  // Create a sample transaction (replace this with your contract's function call if needed)
  const tx = await deployer.sendTransaction({
    to: deployer.address, // Sending to self for demonstration purposes
    value: valueToSend, // Sending 0.01 ETH
  });

  console.log("Transaction hash:", tx.hash);

  // Wait for 1 confirmation
  const receipt = await tx.wait(1);
  console.log("Transaction confirmed in block:", receipt.blockNumber);

  // Define the number of confirmations required for finality (e.g., 12 confirmations)
  const finalityConfirmations = 12;

  console.log(
    `Waiting for ${finalityConfirmations} confirmations for finality...`,
  );

  // Wait for the finality confirmations
  const finalizedReceipt = await tx.wait(finalityConfirmations);

  console.log(
    `Transaction finalized after ${finalityConfirmations} confirmations`,
  );
  console.log("Finalized in block:", finalizedReceipt.blockNumber);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
