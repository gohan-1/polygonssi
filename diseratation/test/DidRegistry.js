const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat");


  describe('DidRegistry',async()=>{

    it('create the did',async()=>{
        const [owner, otherAccount] = await ethers.getSigners();
        const DidRegistryFactory = await ethers.getContractFactory('DidRegistry');
    
    // Deploy the contract
    const _id = owner.address
    const didRegistry = await DidRegistryFactory.deploy();
    const _doc = `{"@context":"https://w3id.org/did/v1","id":"did:polygon:testnet:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","verificationMethod":[{"id":"did:polygon:testnet:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266#key-1","type":"EcdsaSecp256k1VerificationKey2019","controller":"did:polygon:testnet:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","publicKeyBase58":"7Lnm1ez9t4ynPHp7MoG9Lwidg8VKwQLUrUttfvHGXz8LddMc8tQrUUDFukUgpQZRVm4xx9KGyAU8E6v3tBpAHH3oEyyaC"}]}`

    // Call the createDid function
    const tx = await didRegistry.createDID(_id, _doc);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Check the event
  
    console.log(receipt)
    // console.log(await didRegistry.did(_id))
    expect(await didRegistry.getDID(_id)).to.equal(_doc);
    // const event = receipt.events.find(event => event.event === "DidCreated");
    // expect(event.args._id).to.equal(_id);
    // expect(event.args._doc).to.equal(_doc);

    // // Check the DID record
    // const didRecord = await didRegistry.did(_id);
    // expect(didRecord.controller).to.equal(owner.address);
    // expect(didRecord.did_doc).to.equal(_doc);
    // expect(didRecord.created).to.be.a("number");
    // expect(didRecord.updated).to.be.a("number");
    })

    it('store vc details',async()=>{
        const [owner, otherAccount] = await ethers.getSigners();
        const DidRegistryFactory = await ethers.getContractFactory('DidRegistry');
    
    // Deploy the contract
    const _id = owner.address
    const didRegistry = await DidRegistryFactory.deploy();

    const storeVcDetails = await didRegistry.storeVcHash(_id,"1","1232")
    expect(await didRegistry.getVcDetails(_id,"1")).to.equal("1232");



    })
  })

