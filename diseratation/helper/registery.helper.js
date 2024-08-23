// import { ethers } from "ethers";

const {ethers} =require("ethers")

const DidRegistryContract = require("../artifacts/contracts/DIDRegistry.sol/DidRegistry.json");

 class RegistryContractInitialization {
  /**
   * Creates an instance of the polygon DID registry smart contract.
   * @param url
   * @param privateKey
   * @param contractAddress
   * @returns Returns the instance created.
   */
  async instanceCreation(privateKey,url,contractAddress) {

    const provider = new ethers.JsonRpcProvider(url);
    const wallet =new ethers.Wallet(privateKey, provider);

    console.log(contractAddress)
    const registry = new ethers.Contract(
        contractAddress,
        DidRegistryContract.abi,
        wallet
      );

      console.log(await registry.getAddress())
    // const factory = new ethers.ContractFactory(DidRegistryContract.abi, DidRegistryContract.bytecode, wallet)
    // const contract = await factory.deploy()
    // // await contract.deployed()

     
      return registry;


  }
}
 module.exports.RegistryContractInitialization  =RegistryContractInitialization