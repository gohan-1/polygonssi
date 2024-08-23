// import * as log4js from "log4js";
const { DidUriValidation } = require('../helper/did-uri-validation')
const { BaseResponse } = require("../helper/base-response")
const { RegistryContractInitialization } = require("../helper/registery.helper.js");
const { ethers } = require("ethers")
// import { ethers } from "ethers";

// const logger = log4js.getLogger();
// logger.level = `debug`;

/**
 * Update DID document on matic chain.
 * @param did
 * @param didDocJson
 * @param privateKey
 * @param url
 * @param contractAddress
 * @returns Returns transaction hash after updating DID Document on chain.
 */
exports.updateDidDoc=async (
  did,
  didDocJson,
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
      const networkCheckWithUrl= await didUriValidation.networkMatch(
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
        
        loggerWeb.info(didDocJson)
      if (didDocJson) {
        if (
          "@context" in didDocJson&&
          "id" in didDocJson &&
          "verificationMethod" in didDocJson
        ) {
          loggerWeb.info("hii21")
          const didAddress=
            didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;
            loggerWeb.info("hii2")
          // Calling smart contract with update DID document on matic chain
          let txnHash= await registry.functions
            .updateDID(didAddress, didDocJson)
            // .then((resValue: any) => {
            //   return resValue;
            // });

        //   logger.debug(
        //     `[updateDidDoc] txnHash - ${JSON.stringify(txnHash)} \n\n\n`
        //   );

          resolve(BaseResponse.from(txnHash, "Update DID document successfully"));
        } else {
          errorMessage = `Invalid method-specific identifier has been entered!`;
          loggerWeb.info(errorMessage);
          throw new Error(errorMessage);
        }
      } else {
        errorMessage = `Invalid DID has been entered!`;
        loggerWeb.info(errorMessage);
        throw new Error(errorMessage);
      }
    } else {
      errorMessage = `DID does not match!`;
      loggerWeb.info(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    loggerWeb.info(`Error occurred in updateDidDoc function ${error}`);
    throw error;
  }
})

}

