// import * as log4js from "log4js";


const networkConfiguration = require("../config/configuration.json");
const {loggerWeb} = require('../config/logger');

// const logger = log4js.getLogger();
// logger.level = `debug`;

 class DidUriValidation {
  /**
   * Polygon DID match or not.
   * @param did
   * @returns Returns true after polygon DID match successfully.
   */
  async polygonDidMatch(did)  {
    let errorMessage;
    const didWithTestnet= await this.splitPolygonDid(did);

    if (
      (did &&
        didWithTestnet === "testnet" &&
        did.match(/^did:polygon:testnet:0x[0-9a-fA-F]{40}$/)) ||
      (did && did.match(/^did:polygon:0x[0-9a-fA-F]{40}$/))
    ) {
      if (
        (didWithTestnet === "testnet" &&
          did.match(/^did:polygon:testnet:\w{0,42}$/)) ||
        did.match(/^did:polygon:\w{0,42}$/)
      ) {
        return true;
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
  }

  /**
   * Polygon DID and Network match or not.
   * @param did
   * @param url
   * @param contractAddress
   * @returns Returns network url and contract address.
   */
  async networkMatch(
    did,
    url=null,
    contractAddress=null
  ){
    let errorMessage;
    const didWithTestnet = await this.splitPolygonDid(did);

    if (
      url &&
      url === `${networkConfiguration[0].testnet?.URL}` &&
      did &&
      didWithTestnet === "testnet"
    ) {
      url = `${networkConfiguration[0].testnet?.URL}`;
      contractAddress = `${networkConfiguration[0].testnet?.CONTRACT_ADDRESS}`;
      console.log('contacts')
      console.log(CONTRACT_ADDRESS)
      return {
        url,
        contractAddress,
      };
    } else if (!url && did && didWithTestnet === "testnet") {
      url = `${networkConfiguration[0].testnet?.URL}`;
      contractAddress = `${networkConfiguration[0].testnet?.CONTRACT_ADDRESS}`;

      return {
        url,
        contractAddress,
      };
    } else if (!url && did && didWithTestnet !== "testnet") {
      url = `${networkConfiguration[1].mainnet?.URL}`;
      contractAddress = `${networkConfiguration[1].mainnet?.CONTRACT_ADDRESS}`;

      return {
        url,
        contractAddress,
      };
    } else {
      errorMessage = `The DID and url do not match!`;
      loggerWeb.info(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Split polygon DID.
   * @param did
   * @returns Returns Split data value to polygon DID.
   */
  async splitPolygonDid(did){
  
    const splitDidValue= did.split(":")[2];
    return splitDidValue;
  }
}

module.exports.DidUriValidation = DidUriValidation
