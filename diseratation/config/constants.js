// import dotenv from 'dotenv';
// import Joi from 'joi';

const dotenv = require("dotenv")
const Joi = require("joi")
dotenv.config();

exports.appConstants = {
    network: process.env.HEDERA_NETWORK,
    appnetName: 'Example appnet using Hedera Identity SDK',
    didServerUrl: 'http://localhost:8080/',
    didTopicMemo: 'Example appnet DID topic',
    vcTopicMemo: 'Example appnet VC topic',
    apiKey: process.env.API_KEY || '01a41742-aa8e-4dd6-8c71-d577ac7d463c',
};

exports.didConstants = {
    didPrefix: 'did',
    didDocumentContext: 'https://www.w3.org/ns/did/v1',
    didMethodSeparator: ':',
    didParameterSeparator:';',
    didParameterValueSeparator: '=',
    hederaHCS: 'earthid',
    addressBookFileId: 'fid',
    didTopicId: 'tid',
    didRootKeyName:'#did-root-key',
    didRootKeyType:'Ed25519VerificationKey2018'
};

exports.vcConstants = {
    schema:{
        context: '@context',
        id:'id',
        type: 'type',
        credentialSchema: 'credentialSchema',
        issuer: 'issuer',
        issuanceDate: 'issuanceDate',
        credentialStatus: 'credentialStatus',
        proof: 'proof',
        biometric: 'biometrics',
        zkp: 'zkpCredentialSubject'
    },
    proof:{
        proofType: 'Ed25519Signature2018',
        vcVerificationMethod: 'Ed25519Signature2018',
        vcProofPurpose: 'assertionMethod',
        jsonPropertyJWS: 'jws',
        jwsHeader:{
            crit: ['b64'],
            b64: false,
            alg:'EdDSA'
        }
    },
    verifiableCredentialType: 'VerifiableCredential',
    verifiableCredentialEncryptedType: 'Encrypted',
    firstContextEntry: 'https://www.w3.org/2018/credentials/v1',
    documentType: 'MembershipType',
    exampleIdPrefix: 'MembershipType:',
    jsonPropertyCredentialSubject: 'credentialSubject',
    jsonPropertyProof: 'proof',
    jsonPropertyExpirationDate:'expirationDate',
    jsonPropertyCredentialStatus:'credentialStatus',
    credentialSchemaType: 'JsonSchemaValidator2018',
    credentialStatus: ''
};

exports.messageConstants = {
    plainMode: 'plain',
    encrptedMode: 'encrypted',
    operation: {
        did: {
            create: 'create',
            update: 'update',
            revoke: 'delete',
        },
        vc:{
            create: 'issue',
            update: 'update',
            revoke: 'revoke'
        }
    }
};

exports.dbConstants = {
    addressBookTableName: 'address_book_details',
    schemaTableName: `${process.env.SSI_USER}_schema_master`,
    conditionTableName: `${process.env.SSI_USER}_connection_master`
};

exports.schemaRegex = {
    alphabet: {
        type: 'string',
        pattern: '[a-zA-Z]+$'
    },
    alphanumeric: {
        type: 'string'
    },
    email:{
        type: 'string',
        format: 'email'
    },
    date:{
        type: 'date',
        format: 'date-time'
    },
    number:{
        type: 'integer'
    },
    enjoiOptions: [{
        type: 'email',
        base: Joi.string().email(),
    }]
};

exports.Urls={
    URL:{
        zkpUrl:{
            baseURL: 'http://localhost:8080',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': 'Api-Key 01a41742-aa8e-4dd6-8c71-d577ac7d463c'
            }

        }
    }
};

exports.tech5Details = {
    URL:{
        MBAP: {
            baseURL: ' http://gn-testapi.tech5.tech:9090/MBAP',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        idencode: {
            baseURL: 'https://idencode.tech5-sa.com',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    },
    params: {
        MBAP: {
            transactionSource: 'nxGen MBAP TestTool'
        },
        idencode: {
            formKey: 'demog'
        }
    }
};

exports.ZKPConstants = {
    pallier: {
        bitLength: 3072,
    },
    seal: {
        polyModulusDegree: 4096,
        bitSizes: [36, 36, 37],
        bitSize: 60,
    }
};
