const { DidUriValidation } = require('../helper/did-uri-validation')
const { BaseResponse } = require("../helper/base-response")
const { RegistryContractInitialization } = require("../helper/registery.helper.js");
const { ethers } = require("ethers")
const { computeAddress } = require("@ethersproject/transactions");
const { computePublicKey } = require("@ethersproject/signing-key");
const {loggerWeb} = require('../config/logger');
const bs58 = require("bs58");

//const {createVC} = require("../sdk/index")
const sdk = require('../sdk');
const { id } = require('@ethersproject/hash');

async function createKeyPair(privateKey) {
  try {
    const publicKey= computePublicKey(privateKey, true);

    const bufferPublicKey = Buffer.from(publicKey);
    const publicKeyBase58= bs58.encode(bufferPublicKey);

    const address= computeAddress(privateKey);

    return { address, publicKeyBase58 };
  } catch (error) {
    loggerWeb.error(`Error occurred in createKeyPair function ${error}`)
    // loggerError.info(`Error occurred in createKeyPair function ${error}`);
    throw error;
  }
}


const createVerifiableCred = async (data, vcParams) => {   
    
  try {

    const credentialSubject = data;


    const vc = await sdk.createVC(credentialSubject, vcParams)
    const credentialHash = await sdk.createVCHash(vc);
    console.log(credentialHash)


    // var hashStr = '';
    // var credentialHash1 = hashStr.toString(credentialHash)
    
    // for (var i = 0; i < credentialHash1.length; i += 2) {
    //   hashStr += String.fromCharCode(parseInt(credentialHash1.substr(i, 2), 16));
    // }
    // console.log(hashStr, "this is hash string")
    console.log(vc)

    return [  vc , credentialHash]

  } catch (error) {
    throw new Error(error.message);
  }
}



const createVc = async (did,credentialHash,
  privateKey, 
  url=null,
  contractAddress=null) => {

  return new Promise(async(resolve, reject) => {
  try {
    let errorMessage
      const didUriValidation= new DidUriValidation();
      const registryContractInitialization =
        new RegistryContractInitialization();
        console.log(1)
  
      const didMethodCheck= await didUriValidation.polygonDidMatch(did);
      const didWithTestnet= await didUriValidation.splitPolygonDid(did);
      console.log(1)
      if (didMethodCheck) {
        console.log(2)
        const kp = await createKeyPair(privateKey);
        console.log(3)
        const networkCheckWithUrl= await didUriValidation.networkMatch(
          did,
          url,
          process.env.CONTACT_ADDRESS
        );
        console.log(3.5)
         console.log(did &&
          didWithTestnet === "testnet" &&
          did.split(":")[3] === kp.address)  
        if (did && credentialHash) {
          console.log(4)
          const registry =
            await registryContractInitialization.instanceCreation(
              privateKey,
              networkCheckWithUrl.url,
              process.env.CONTACT_ADDRESS
            );
            console.log(5)
          const didAddress =
            didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;
            //yourNumber = parseInt(hexString, 16);
            console.log('didadress')
            console.log(didAddress)
            console.log('did')
            console.log(did)
            let value_Hash= await registry.storeVcHash(didAddress, did,credentialHash.toString());
            console.log(value_Hash);
            resolve(BaseResponse.from(value_Hash, "Stored Hash successfully"));

            }
          }
}catch (error) {
    loggerWeb.info(`Error occurred in updateDidDoc function ${error}`);
    throw error;
  }
  })
}





  const getVc =async (
    did,
    privateKey, // Todo: look for better way to address private key passing mechanism
    url=null,
    contractAddress=null
  )=>{ 
      return new Promise(async(resolve, reject) => {
      
      try {
      let errorMessage
      const didUriValidation= new DidUriValidation();
      const registryContractInitialization =
        new RegistryContractInitialization();
  
      const didMethodCheck= await didUriValidation.polygonDidMatch(did);
      const didWithTestnet= await didUriValidation.splitPolygonDid(did);
  
      if (didMethodCheck) {
        const kp = await createKeyPair(privateKey);
        
        const networkCheckWithUrl= await didUriValidation.networkMatch(
          did,
          url,
          contractAddress
        );
  
        if (
          (did &&
            didWithTestnet === "testnet" &&
            did.split(":")[3] === kp.address) ||
          (did && didWithTestnet === kp.address)
        ) {
          const registry =
            await registryContractInitialization.instanceCreation(
              privateKey,
              networkCheckWithUrl.url,
              process.env.CONTACT_ADDRESS
            );
          const didAddress =
            didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;
            console.log('didadress')
            console.log(didAddress)
            console.log('did')
            console.log(did)
          let txnHash= await registry.getVcDetails(didAddress,did)
            
              // .then((resValue: any) => {
              //   return resValue;
              // });
  
          //   logger.debug(
          //     `[updateDidDoc] txnHash - ${JSON.stringify(txnHash)} \n\n\n`
          //   );
          console.log(txnHash)
  
            resolve(BaseResponse.from(txnHash, "Update DID document successfully"));

      } else {
        errorMessage = `DID does not match!`;
        loggerWeb.info(errorMessage);
        throw new Error(errorMessage);
      }
    }else {
      errorMessage = `DID does not match!`;
      loggerWeb.error(errorMessage);
      throw new Error(errorMessage);
    }
    } catch (error) {
      loggerWeb.info(`Error occurred in updateDidDoc function ${error}`);
      throw error;
    }
  })
  
  }





module.exports = {
    createVc,
    getVc,
    createVerifiableCred
    
};