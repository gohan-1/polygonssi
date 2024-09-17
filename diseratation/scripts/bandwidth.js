const { ethers } = require("hardhat");

async function main() {
    // Number of transactions to analyze
    const numTransactions = 100;

    // Get the latest block number
    const latestBlockNumber = await ethers.provider.getBlockNumber();

    if (latestBlockNumber < numTransactions) {
        console.error("Not enough blocks to analyze.");
        return;
    }

    let totalTransactionSize = 0;

    // Iterate over the last numTransactions blocks
    for (let i = latestBlockNumber; i > latestBlockNumber - numTransactions; i--) {
        const block = await ethers.provider.getBlock(i);

        // Make sure the block has transactions
        if (block.transactions.length === 0) {
            continue;
        }

        for (let txHash of block.transactions) {
            const tx = await ethers.provider.getTransaction(txHash);
            totalTransactionSize += tx.data.length / 2; // Each byte is represented by two hex digits
        }
    }

    const averageTransactionSize = totalTransactionSize / numTransactions;

    // Assuming you already have TPS (Transactions per Second)
    const TPS = 77.94; // Example TPS
    const bandwidth = TPS * averageTransactionSize; // Bytes per second

    console.log(`Average Bandwidth: ${bandwidth} bytes/second`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
