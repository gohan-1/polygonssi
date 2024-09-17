const { ethers } = require("hardhat");

async function main() {
    const [owner, otherAccount] = await ethers.getSigners();
    const DidRegistryFactory = await ethers.getContractFactory('DidRegistry');
    
    const didRegistry1 = await DidRegistryFactory.deploy();

    // Parameters for creating DID
    const didDoc = "Example DID Document";
    const numTransactions = 100; // Number of transactions to simulate

    console.log(`address ${didRegistry1.target}`)

    // Measure start time
    const startTime = Date.now();

    for (let i = 0; i < numTransactions; i++) {
        const newAddress = ethers.Wallet.createRandom().address; // Generate a random address for each DID
        const tx = await didRegistry1.createDID(newAddress, didDoc);
        await tx.wait(); // Wait for the transaction to be mined
        console.log(`Transaction ${i + 1} sent: DID created for address ${newAddress}`);
    }

    // Measure end time
    const endTime = Date.now();

    // Calculate TPS
    const totalTimeInSeconds = (endTime - startTime) / 1000;
    const tps = numTransactions / totalTimeInSeconds;

    console.log(`Processed ${numTransactions} transactions in ${totalTimeInSeconds} seconds`);
    console.log(`TPS: ${tps}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
