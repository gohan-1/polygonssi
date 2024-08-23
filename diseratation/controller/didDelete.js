// import * as log4js from "log4js";
const {BaseResponse} = require('../helper/base-response')
const { DidUriValidation } = require("../helper/did-uri-validation.js");
const { RegistryContractInitialization } = require("../helper/registery.helper.js");
const { ethers }= require("ethers");

// const logger = log4js.getLogger();
// logger.level = `debug`;

/**
 * Delete DID Document.
 * @param did
 * @param privateKey
 * @param url
 * @param contractAddress
 * @returns Return transaction hash after deleting DID Document on chain.
 */
exports.deleteDidDoc =async(
  did,
  privateKey,
  url=null,
  contractAddress=null,
)=>{return new Promise(async(resolve, reject) => { 
  try {
    let errorMessage;
    const didUriValidation= new DidUriValidation();
    const registryContractInitialization =
      new RegistryContractInitialization();

    const didMethodCheck = await didUriValidation.polygonDidMatch(did);
    const didWithTestnet = await didUriValidation.splitPolygonDid(did);

    if (didMethodCheck) {
      const networkCheckWithUrl = await didUriValidation.networkMatch(
        did,
        url,
        contractAddress
      );

      const registry =
        await registryContractInitialization.instanceCreation(
          privateKey,
          networkCheckWithUrl.url,
          networkCheckWithUrl.contractAddress
        );
      const didAddress=
        didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;
          loggerWeb.info(await registry.functions)
      let txnHash= await registry.functions
        .deleteDID(didAddress)
        // .then((resValue) => {
        //   resolve(resValue);
        // });

      loggerWeb.info(
        `[deleteDidDoc] txnHash - ${JSON.stringify(txnHash)} \n\n\n`
      );

      resolve(BaseResponse.from(txnHash, "Delete DID document successfully"));
    } else {
      errorMessage = `DID does not match!`;
      loggerWeb.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    loggerWeb.error(`Error occurred in deleteDidDoc function ${error}`);
    throw error;
  }
}).catch((error)=>{reject(error)});
}