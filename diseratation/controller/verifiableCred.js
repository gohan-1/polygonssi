const { DidUriValidation } = require("../helper/did-uri-validation");
const { BaseResponse } = require("../helper/base-response");
const {
  RegistryContractInitialization,
} = require("../helper/registery.helper.js");
const { ethers } = require("ethers");
const { computeAddress } = require("@ethersproject/transactions");
const { computePublicKey } = require("@ethersproject/signing-key");
const { loggerWeb } = require("../config/logger");
const bs58 = require("bs58");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

//const {createVC} = require("../sdk/index")
const sdk = require("../sdk");
const { id } = require("@ethersproject/hash");

async function createKeyPair(privateKey) {
  try {
    const publicKey = computePublicKey(privateKey, true);

    const bufferPublicKey = Buffer.from(publicKey);
    const publicKeyBase58 = bs58.encode(bufferPublicKey);

    const address = computeAddress(privateKey);

    return { address, publicKeyBase58 };
  } catch (error) {
    loggerWeb.error(`Error occurred in createKeyPair function ${error}`);
    // loggerError.info(`Error occurred in createKeyPair function ${error}`);
    throw error;
  }
}

const createVerifiableCred = async (data, vcParams) => {
  try {
    const credentialSubject = data;

    const vc = await sdk.createVC(credentialSubject, vcParams);

    // Read the private key from the file
    const privateKeyPath = path.join(__dirname, "../privateKey.pem");
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    // Create the sign object and sign the data
    const sign = crypto.createSign("SHA256");
    console.log(
      "---------------------------------------------------sadas------------",
    );
    console.log(credentialSubject.userDid);
    sign.update(credentialSubject.userDid);
    sign.end();

    // Sign the data using the private key
    const signature = sign.sign(privateKey).toString("base64");

    // Send back the data and signature
    vc["sign"] = signature;
    const credentialHash = await sdk.createVCHash(vc);

    // var hashStr = '';
    // var credentialHash1 = hashStr.toString(credentialHash)

    // for (var i = 0; i < credentialHash1.length; i += 2) {
    //   hashStr += String.fromCharCode(parseInt(credentialHash1.substr(i, 2), 16));
    // }
    // console.log(hashStr, "this is hash string")

    return [vc, credentialHash];
  } catch (error) {
    throw new Error(error.message);
  }
};

const createVc = async (
  did,
  credentialHash,
  privateKey,
  url = null,
  contractAddress = null,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let errorMessage;
      const didUriValidation = new DidUriValidation();
      const registryContractInitialization =
        new RegistryContractInitialization();
      console.log(1);

      const didMethodCheck = await didUriValidation.polygonDidMatch(did);
      const didWithTestnet = await didUriValidation.splitPolygonDid(did);

      if (didMethodCheck) {
        const kp = await createKeyPair(privateKey);

        const networkCheckWithUrl = await didUriValidation.networkMatch(
          did,
          url,
          process.env.CONTACT_ADDRESS,
        );

        if (did && credentialHash) {
          const registry =
            await registryContractInitialization.instanceCreation(
              privateKey,
              networkCheckWithUrl.url,
              process.env.CONTACT_ADDRESS,
            );
          console.log(5);
          const didAddress =
            didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;
          //yourNumber = parseInt(hexString, 16);
          console.log("didadress---------------------------------------------");
          console.log(didAddress);
          console.log("did----------------------");
          console.log(did);
          let value_Hash = await registry.storeVcHash(
            didAddress,
            did,
            credentialHash.toString(),
          );
          console.log(value_Hash);
          resolve(BaseResponse.from(value_Hash, "Stored Hash successfully"));
        }
      }
    } catch (error) {
      loggerWeb.info(`Error occurred in updateDidDoc function ${error}`);
      throw error;
    }
  });
};

const getVc = async (
  did,
  privateKey, // Todo: look for better way to address private key passing mechanism
  url = null,
  contractAddress = null,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let errorMessage;
      const didUriValidation = new DidUriValidation();
      const registryContractInitialization =
        new RegistryContractInitialization();

      const didMethodCheck = await didUriValidation.polygonDidMatch(did);
      const didWithTestnet = await didUriValidation.splitPolygonDid(did);

      if (didMethodCheck) {
        const kp = await createKeyPair(privateKey);

        const networkCheckWithUrl = await didUriValidation.networkMatch(
          did,
          url,
          contractAddress,
        );

        if (did) {
          const registry =
            await registryContractInitialization.instanceCreation(
              privateKey,
              networkCheckWithUrl.url,
              process.env.CONTACT_ADDRESS,
            );
          const didAddress =
            didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;
          console.log("didadress");
          console.log(didAddress);
          console.log("did");
          console.log(did);
          let txnHash = await registry.getVcDetails(didAddress, did);

          console.log(txnHash);

          resolve(
            BaseResponse.from(txnHash, "Update DID document successfully"),
          );
        } else {
          errorMessage = `DID does not match!`;
          loggerWeb.info(errorMessage);
          throw new Error(errorMessage);
        }
      } else {
        errorMessage = `DID does not match!`;
        loggerWeb.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      loggerWeb.info(`Error occurred in updateDidDoc function ${error}`);
      throw error;
    }
  });
};

module.exports = {
  createVc,
  getVc,
  createVerifiableCred,
};
