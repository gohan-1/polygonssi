const { ethers } = require("hardhat");

async function main() {
    // Specify how many blocks you want to calculate the average block time over
    const numBlocks = 100;
    
    // Get the latest block number
    const latestBlockNumber = await ethers.provider.getBlockNumber();
    
    let totalBlockTime = 0;

    for (let i = latestBlockNumber; i > latestBlockNumber - numBlocks; i--) {
        // Get the current and previous block
        const currentBlock = await ethers.provider.getBlock(i);
        const previousBlock = await ethers.provider.getBlock(i - 1);

        // Calculate time difference (in seconds) between the two blocks
        const blockTimeDifference = currentBlock.timestamp - previousBlock.timestamp;
        
        totalBlockTime += blockTimeDifference;
    }

    // Calculate the average block time
    const averageBlockTime = totalBlockTime / numBlocks;

    console.log(`Average Block Time over ${numBlocks} blocks: ${averageBlockTime} seconds`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
