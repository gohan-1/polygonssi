const {dbConstants} = require('../config/constants');
// import dbHelper from '../utils/dbHelper';

const dbHelper =require('../utils/dbHelper');

const { VerifiableCredential } = require("../models/verifiableCredentialSchema");


exports.createSchemaInTable = async (schema, expiration, dependantSchemas) =>{
    try {
        const params = {
       
            Item:{
                schemaName: schema.title,
                description: schema.description,
                jsonSchema: schema,
                expiration: expiration,
                dependantSchemas: dependantSchemas,
                status: 'active'
            }
        };
        return await dbHelper.insertIntoTable(params);
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getSchemaByKey = async (schemaName) =>{
    try {
        const params = {
            TableName: dbConstants.schemaTableName,
            Key: {
                schemaName: schemaName
            }
        };
        return await dbHelper.getDataFromTable(params);
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getAllSchema = async () =>{
    try {
   
        return await VerifiableCredential.find({})
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.createConditionsInTable = async (conditionDetails) =>{
    try {
        const params = {
            TableName: dbConstants.conditionTableName,
            Item: {...conditionDetails}
        };
        return await dbHelper.insertIntoTable(params);
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.getAllConditions = async () =>{
    try {
        const params = {
            TableName: dbConstants.conditionTableName,
            Select: 'ALL_ATTRIBUTES'
        };
        return await dbHelper.getAllDataFromTable(params);
    } catch (error) {
        throw new Error(error.message);
    }
};
