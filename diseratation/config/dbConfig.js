// import dotenv from 'dotenv';
const dotenv = require("dotenv");
// const dotenv
dotenv.config();
exports.dbConfig =
  process.env.NODE_ENV === "production"
    ? {
        accessKeyId: process.env.awsAccessKeyId,
        secretAccessKey: process.env.awsSecretAccessKey,
        region: process.env.region,
      }
    : {
        accessKeyId: process.env.awsAccessKeyId,
        secretAccessKey: process.env.awsSecretAccessKey,
        region: process.env.region,
        endpoint: process.env.DYNAMO_DB_ENDPOINT || "http://localhost:8000",
      };
