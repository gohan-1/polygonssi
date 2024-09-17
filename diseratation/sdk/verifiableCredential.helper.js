// import {PrivateKey} from '@hashgraph/sdk';
const {uuid4} = require ('uuid');
const moment = require ('moment');
const util = require ('../utils/crypto');
const {vcConstants, didConstants} = require('../config/constants');
const {forEach} = require('lodash');
 const {loggerSDK} = require('../config/logger');


const generateVC = async (credentialSubject, vcParams) => {
    try {
        const verifiableCredential = {};
        
        verifiableCredential[vcConstants.schema.context] = [vcConstants.firstContextEntry];
        //verifiableCredential[vcConstants.schema.id] = `${vcParams.documentType}:${uuid4()}`;
        //verifiableCredential[vcConstants.schema.type] = [vcConstants.verifiableCredentialType, vcParams.documentType];
        
        //verifiableCredential[vcConstants.schema.credentialSchema] = {id:vcParams.schemaUrl,type:vcConstants.credentialSchemaType};
        //verifiableCredential[vcConstants.schema.issuer] = issuerDid;
        verifiableCredential[vcConstants.jsonPropertyCredentialSubject] = [credentialSubject];
        //verifiableCredential[vcConstants.schema.issuanceDate] = moment().toISOString();
        //verifiableCredential[vcConstants.jsonPropertyExpirationDate] = vcParams.expiration;
        verifiableCredential[vcConstants.jsonPropertyCredentialStatus] = vcConstants.credentialStatus;
        //console.log(verifiableCredential)
        return verifiableCredential;
    } catch (error) {
        throw new Error(error.message);
    }
};

// const createMessage = (operation, hash) => {
//     try {
//         const timestamp = moment().toISOString();
//         return {operation, credentialHash: hash, timestamp};
//     } catch (error) {
//         // throw new Error(error.message);
//     }
// };

exports.createVerifiableCred = async ( credentialSubject, vcParams) => {
    try {
        // const decodedPrivateKey = util.decodeBase64(encodedPrivateKey);
        // const privateKey = PrivateKey.fromString(decodedPrivateKey);
        return await generateVC(credentialSubject, vcParams);
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.vcToHash = async (verifiableCredential) => {
    try {
        
        const credentialHash = await util.hashWithSHA256(JSON.stringify(verifiableCredential));
        return await util.encodeBase58(credentialHash);
    } catch (error) {
        throw new Error(error.message);
    }
};



