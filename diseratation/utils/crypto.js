const SHA256 = require("crypto-js/sha256");
const Hex = require("crypto-js/enc-hex");
// import Base64 from 'crypto-js/enc-base64';
// import Utf8 from 'crypto-js/enc-utf8';
const bs58 = require("bs58");
// import { PublicKey } from '@hashgraph/sdk';
const { forEach } = require("lodash");
// import bigInt from 'big-integer';

exports.hashWithSHA256 = (content) => {
  try {
    const buffer = Buffer.from(SHA256(content).toString(Hex), "hex");
    // return new Uint8Array(buffer);
    return buffer;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.encodeBase58 = (content) => {
  try {
    if (!(content instanceof Uint8Array)) {
      throw new Error("Invalid content for encoding - Must be Uint8Array");
    }
    return bs58.encode(content);
  } catch (error) {
    throw new Error(error.message);
  }
};
