const rht = require('hardhat');


async function main(){


    const [owner, otherAccount] = await ethers.getSigners();
    const DidRegistryFactory = await ethers.getContractFactory('DidRegistry');
    
    // Deploy the contract
    const didRegistry = await DidRegistryFactory.deploy();


    // await didRegistry.deployed()

    console.log(`address ${didRegistry.target}`)



}


main().catch((error)=>{
console.error(error);
process.exitCode = 1; 
})