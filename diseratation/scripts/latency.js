const { ethers } = require("hardhat");

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();
  const DidRegistryFactory = await ethers.getContractFactory("DidRegistry");

  const didRegistry1 = await DidRegistryFactory.deploy();

  // Parameters for creating DID
  const didDoc = "Example DID Document";
  const numTransactions = 100; // Number of transactions to simulate

  // Measure start time
  const startTime = Date.now();

  let totalLatency = 0;

  for (let i = 0; i < numTransactions; i++) {
    const newAddress = ethers.Wallet.createRandom().address; // Generate a random address for each DID

    // Measure the time of transaction submission
    const txStart = Date.now();

    // Submit transaction
    const tx = await didRegistry1.createDID(newAddress, didDoc);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Get the block in which the transaction was included
    const block = await ethers.provider.getBlock(receipt.blockNumber);

    // Calculate latency
    const txEnd = block.timestamp * 1000; // Convert block timestamp to milliseconds
    const latency = txEnd - txStart;
    totalLatency += latency;

    console.log(
      `Transaction ${i + 1} sent: DID created for address ${newAddress}`,
    );
    console.log(`Latency for transaction ${i + 1}: ${latency} ms`);
  }

  // Measure end time
  const endTime = Date.now();

  // Calculate TPS
  const totalTimeInSeconds = (endTime - startTime) / 1000;
  const tps = numTransactions / totalTimeInSeconds;

  // Calculate average latency
  const avgLatency = totalLatency / numTransactions;

  console.log(
    `Processed ${numTransactions} transactions in ${totalTimeInSeconds} seconds`,
  );
  console.log(`TPS: ${tps}`);
  console.log(`Average Latency: ${avgLatency / 1000} seconds`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
