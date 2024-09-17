
// const  log4js = require("log4js");
const bs58 = require("bs58");
const { ethers } = require("ethers");
const { Wallet}   = require("@ethersproject/wallet") ;
const { computeAddress } = require("@ethersproject/transactions");
const { computePublicKey } = require("@ethersproject/signing-key");
const {loggerWeb} = require('../config/logger');

// import  {loggerError,loggerDebug}  from '../config/logger.js';

const {BaseResponse} = require('../helper/base-response')
const { DidUriValidation } = require("../helper/did-uri-validation.js");
const { RegistryContractInitialization } = require("../helper/registery.helper.js");
const { cache } = require("joi");




exports.createDID= async (network,privateKey=null)=>{
    try {

        let errorMessage
        let did, _privateKey, wall, _a, error_1;
    
        if (privateKey) {
          _privateKey = privateKey;
        }else {
            wall = Wallet.createRandom();
            _privateKey = wall.privateKey;
            loggerWeb.info(typeof(_privateKey))
        }
    
   
        const { address, publicKeyBase58 } = await createKeyPair(_privateKey);
    
        if (network === "testnet") {
          did = `did:polygon:testnet:${address}`;
        } else if (network === "mainnet") {
          did = `did:polygon:${address}`;
        } else {
          errorMessage = `Wrong network enter!`;
          loggerWeb.info(errorMessage);
          throw new Error(errorMessage);
        }
    
        loggerWeb.info(did)
        console.log(did)
        // loggerDebug.info("[createDID] address - ".concat(JSON.stringify(address), " \n\n\n"));
        // loggerDebug.info("[createDID] did - ".concat(JSON.stringify(did), " \n\n\n"));
        
        return(
          { address, publicKeyBase58, _privateKey, did });
      } catch (error) {
        // loggerError.info(`Error occurred in createDID function ${error}`);
        throw error;
      }
}

async function wrapDidDocument(
  did,
  publicKeyBase58
){
  return {
    "@context": "https://w3id.org/did/v1",
    id: did,
    verificationMethod: [
      {
        id: `${did}#key-1`,
        type: "EcdsaSecp256k1VerificationKey2019", // external (property value)
        controller: did,
        publicKeyBase58: publicKeyBase58,
      },
    ],
  };
}

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

exports.getDID = async (
  did,
    privateKey,
    url=null,  
    contractAddress=null
  )=>{ 
    return new Promise(async(resolve, reject) => {
    try {
      let errorMessage;
    
      const didUriValidation = new DidUriValidation();
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
          console.log(didAddress)
          let resolveDidDoc= await registry.getDID(didAddress)
          
        
          
            resolve(resolveDidDoc);

          
           
            }
          }
        }catch (error) {
          loggerWeb.error(`Error occurred in registerDID function  ${error}`);
          throw error;
        }
      })
  
          // if (resolveDidDoc.includes("")) {
          //   // Get DID document

 
  
}

  exports.registerDID= async(
    did,
    privateKey,
    url=null,  
    contractAddress=null
  )=>{ 
    return new Promise(async(resolve, reject) => {
    try {
      let errorMessage;
    
      const didUriValidation = new DidUriValidation();
      const registryContractInitialization =
        new RegistryContractInitialization();
  
      const didMethodCheck= await didUriValidation.polygonDidMatch(did);
      const didWithTestnet= await didUriValidation.splitPolygonDid(did);
  
      if (didMethodCheck) {
        const kp = await createKeyPair(privateKey);
        console.log('kp')
        console.log(did)
        const networkCheckWithUrl= await didUriValidation.networkMatch(
          did,
          url,
          contractAddress
        );
console.log(kp.address)
        if (
          (did )
        ) {
          
          const registry =
            await registryContractInitialization.instanceCreation(
              privateKey,
              networkCheckWithUrl.url,
              process.env.CONTACT_ADDRESS
            );

            console.log(registry)
          const didAddress =
            didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;
          console.log(didAddress)
          // let resolveDidDoc= await registry.getDID(didAddress)
          // console.log('------------------------------------------------------------------')
          //   console.log(resolveDidDoc)
          
           
  
  
          // if (resolveDidDoc.includes("")) {
          //   // Get DID document
           

            const didDoc= await wrapDidDocument(did, kp.publicKeyBase58);
            const stringDidDoc = JSON.stringify(didDoc);

            
              console.log(stringDidDoc)
            // Calling smart contract with register DID document on matic chain
            const txnHash = await registry.createDID(didAddress, stringDidDoc)
             
            await txnHash.wait();


            // Remove the "0x" prefix
           let hexData =txnHash.data
            const hexWithoutPrefix = hexData.substring(202);

            console.log('------------------------------------------------')
            console.log(hexWithoutPrefix)

            // Convert hex to bytes
            const bytes = Buffer.from(hexWithoutPrefix, 'hex');

            // Convert bytes to string
            const jsonString = bytes.toString('utf8');
            console.log(jsonString)

            // Try parsing the JSON string if applicable
            let decodedObject;
            try {
                decodedObject = JSON.parse(JSON.stringify(jsonString));
            } catch (error) {
                console.error("Failed to parse JSON:", error);
            }

            // console.log(jsonString); // Prints the decoded string
            // console.log(decodedObject);
                        
            
            loggerWeb.info(
              `[registerDID] txnHash - ${JSON.stringify(decodedObject)} \n\n\n`
            );

            console.log(`[registerDID] txnHash - ${JSON.stringify(decodedObject)} \n\n\n`)
            

  
            resolve( BaseResponse.from(
              { did, decodedObject },
              "Registered DID document successfully."
            ));

          //   let resolveDidDoc1= await registry.getDID(didAddress)
          // console.log('------------------------------------------------------------------')
          //   console.log(resolveDidDoc1)
          // } else {

            
          //   errorMessage = `The DID document already registered!`;

          //   loggerWeb.error(errorMessage);
          //   resolve(`The DID document already registered!`+ " \n\n"+resolveDidDoc)
          //   throw new Error(errorMessage);
          // // }
        } else {
          errorMessage = `Private key and DID uri do not match!`;
          loggerWeb.info(errorMessage);
          throw new Error(errorMessage);
        }
      } else {
        errorMessage = `DID does not match!`;
        loggerWeb.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      loggerWeb.error(`Error occurred in registerDID function  ${error}`);
      throw error;
    }


  }).catch((error)=>{reject(error)});
  
  }
  

  
   
  
  