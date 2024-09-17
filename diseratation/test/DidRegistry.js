const { ethers } = require("hardhat");
const { expect } = require("chai");

describe('DidRegistry', () => {

  let didRegistry;
  let owner;
  let otherAccount;
  const didDoc = '{"@context":"https://w3id.org/did/v1","id":"did:example:testnet:0x123"}';
  const vcHash = "vcHash123";
  const didIdentifier = "did:test:123";

  beforeEach(async () => {
    [owner, otherAccount] = await ethers.getSigners();
    const DidRegistryFactory = await ethers.getContractFactory('DidRegistry');
    didRegistry = await DidRegistryFactory.deploy();
  });

  // Test createDID function
  it('should successfully create a DID', async () => {
    const tx = await didRegistry.createDID(owner.address, didDoc);
    await tx.wait();

    expect(await didRegistry.getDID(owner.address)).to.equal(didDoc);
  });

  // Test updateDID function
  it('should update a DID', async () => {
    const updatedDoc = '{"@context":"https://w3id.org/did/v1","id":"did:example:testnet:0x123_updated"}';
    await didRegistry.createDID(owner.address, didDoc);

    const tx = await didRegistry.updateDID(owner.address, updatedDoc);
    await tx.wait();

    expect(await didRegistry.getDID(owner.address)).to.equal(updatedDoc);
  });

  // Test storeVcHash and getVcDetails
  it('should store and retrieve VC details', async () => {
    await didRegistry.storeVcHash(owner.address, didIdentifier, vcHash);
    console.log(owner.address)
    console.log(didIdentifier)
    expect(await didRegistry.getVcDetails(owner.address, didIdentifier)).to.equal(vcHash);
  });

  // Test deleteDID function
  it('should delete a DID', async () => {
    await didRegistry.createDID(owner.address, didDoc);
    await didRegistry.deleteDID(owner.address);

    expect(await didRegistry.getDID(owner.address)).to.equal('');
  });

  // Test finalizeDID function
  it('should finalize a DID after sufficient blocks', async () => {
    await didRegistry.createDID(owner.address, didDoc);

    // Move forward by the required number of blocks
    await ethers.provider.send("evm_increaseTime", [12]);
    await ethers.provider.send("evm_mine", []);

    const tx = await didRegistry.finalizeDID(owner.address);
    await tx.wait();

    expect(await didRegistry.isDIDFinalized(owner.address)).to.be.true;
  });



  // Negative test cases

  // Test revert on unauthorized updateDID
  it('should revert if a non-controller tries to update a DID', async () => {
    await didRegistry.createDID(owner.address, didDoc);

    await expect(
      didRegistry.connect(otherAccount).updateDID(owner.address, didDoc)
    ).to.be.revertedWith("message sender is not the controller");
  });

  // Test revert if trying to finalize already finalized DID
  it('should revert if DID is already finalized', async () => {
    await didRegistry.createDID(owner.address, didDoc);
    await ethers.provider.send("evm_increaseTime", [12]);
    await ethers.provider.send("evm_mine", []);

    await didRegistry.finalizeDID(owner.address);

    await expect(
      didRegistry.finalizeDID(owner.address)
    ).to.be.revertedWith("DID is already finalized");
  });

  // Test revert if trying to finalize too early
  it('should revert if not enough blocks have passed to finalize DID', async () => {
    await didRegistry.createDID(owner.address, didDoc);

    await expect(
      didRegistry.finalizeDID(owner.address)
    ).to.be.revertedWith("Not enough blocks have passed for finality");
  });

  // Test revert on unauthorized deleteDID
  it('should revert if a non-controller tries to delete a DID', async () => {
    await didRegistry.createDID(owner.address, didDoc);

    await expect(
      didRegistry.connect(otherAccount).deleteDID(owner.address)
    ).to.be.revertedWith("message sender is not the controller");
  });

  // Test revert on unauthorized storeVcHash
  it('should revert if a non-owner tries to store VC hash', async () => {
    await expect(
      didRegistry.connect(otherAccount).storeVcHash(owner.address, didIdentifier, vcHash)
    ).to.be.revertedWith("message sender is not the owner");
  });

    // Test revert on unauthorized updateDID
    it('should revert if a non-controller tries to update a DID', async () => {
      await didRegistry.createDID(owner.address, didDoc);
  
      await expect(
        didRegistry.connect(otherAccount).updateDID(owner.address, didDoc)
      ).to.be.revertedWith("message sender is not the controller");
    });
  
  // Test revert if trying to finalize too early
  it('should revert if not enough blocks have passed to finalize DID', async () => {
    await didRegistry.createDID(owner.address, didDoc);

    await expect(
      didRegistry.finalizeDID(owner.address)
    ).to.be.revertedWith("Not enough blocks have passed for finality");
  });

    // Test revert on unauthorized deleteDID
    it('should revert if a non-controller tries to delete a DID', async () => {
      await didRegistry.createDID(owner.address, didDoc);
  
      await expect(
        didRegistry.connect(otherAccount).deleteDID(owner.address)
      ).to.be.revertedWith("message sender is not the controller");
    });
  
      // Test revert on unauthorized storeVcHash
  it('should revert if a non-owner tries to store VC hash', async () => {
    await expect(
      didRegistry.connect(otherAccount).storeVcHash(owner.address, didIdentifier, vcHash)
    ).to.be.revertedWith("message sender is not the owner");
  });

});
