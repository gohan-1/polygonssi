const AWS= require('aws-sdk');
const {dbConfig}= require('../config/dbConfig');
const {dataBaseModels}= require('../models');
const {loggerWeb}= require('../config/logger');
const { VerifiableCredential } = require("../models/verifiableCredentialSchema");


 console.log(dbConfig)

AWS.config.update(dbConfig);


const listTables = () => {
    return new Promise((resolve, reject)=>{
        const dynamodb = new AWS.DynamoDB();
        dynamodb.listTables((error,data)=>{
            if (error) {
                reject(new Error('Unable to list tables. Error JSON:', JSON.stringify(error, null, 2)));
            } else {
                resolve(data.TableNames);
            }
        });
    });
};

exports.createTables = async () => {
    try {
        console.log("inside create table")
        const dynamodb = new AWS.DynamoDB();
        const tableList = await listTables();
    
        dataBaseModels.forEach(schema => {
         
            if(!tableList.includes(schema.TableName)){
                console.log(schema.verifiableCredentialSchema)
                dynamodb.createTable(schema.verifiableCredentialSchema, (err, data) => {
                    if (err) {
                        console.log(err)
                        throw new Error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
                    } else {
                        loggerWeb.info('Created table. Table description JSON:', JSON.stringify(data, null, 2));
                    }
                });
            }
        });

    } catch (error) {
        throw new Error(error.message);
    }
};

exports.insertIntoTable = async (params) => {
    //loggerWeb.info('insertIntoTable: ', params);

    const small = new VerifiableCredential({ attributes: params });
    await small.save();

};

exports.getDataFromTable = (params) => {
    return new Promise((resolve, reject) => {
        const docClient = new AWS.DynamoDB.DocumentClient();
        docClient.get(params, function (error, dbResult) {
            if (error) {
                //loggerWeb.error('getDataFromTable Err: ', JSON.stringify(error, null, 2));
                reject(error);
            } else {
                if (Object.keys(dbResult).length !== 0 && dbResult.constructor === Object) {
                    resolve(dbResult.Item);
                } else {
                    resolve(null);
                }
            }
        });
    });
};

exports.getAllDataFromTable = (params) => {
    return new Promise((resolve, reject) => {
        const docClient = new AWS.DynamoDB.DocumentClient();
        docClient.scan(params, function (err, dbResult) {
            if (err) {
                //loggerWeb.error('getDataFromTable Err: ', JSON.stringify(err, null, 2));
                reject(err);
            } else {
                if (Object.keys(dbResult).length !== 0 && dbResult.constructor === Object) {
                    resolve(dbResult.Items);
                } else {
                    resolve(null);
                }
            }
        });
    });
};
