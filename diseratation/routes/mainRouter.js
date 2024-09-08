const express = require("express");
require('dotenv').config()
// const dotenv = require("dotenv")
const router = new express.Router({ mergeParams : true });
const {createDID,registerDID,getDID} = require('../controller/register.js')
const  {deleteDidDoc}  = require("../controller/didDelete");
const  {updateDidDoc} = require('../controller/update')
const vcController = require('../controller/verifiableCred')
const schemaController = require('../controller/schemaController') 
const {loggerWeb} = require('../config/logger');
const { response } = require("express");
const userController = require('../controller/userController.js')
const sdk = require('../sdk');
const createError = require('http-errors');



router.get("/api/issuer/createDid",async (req, res,next) => {
    try{
        const privateKey = req.query.privateKey ? req.query.privateKey : process.env.PRIVATEKEY
        loggerWeb.info(req.query)
      const  { address, publicKeyBase58, _privateKey, did }= await createDID(process.env.NETWORK,privateKey)
      res.send(did)
    } catch (error) {
        next(error);
    }
           
});
router.post("/api/issuer/getDID", async (req, res,next) => {
    try{
        const privateKey = req.query.privateKey ? req.query.privateKey : process.env.PRIVATEKEY
        const did = req.body.did
        const token = await getDID(did,privateKey);
        res.send(token);
    } catch (error) {
    next(error);
    }
   
});



router.post("/api/issuer/storeVc",async (req, res,next) => {
    try{
        const did = req.body.did
        const credentialHash = req.body.credentialHash
        const privateKey = req.query.privateKey ? req.query.privateKey : process.env.PRIVATEKEY
        console.log(did)
        console.log(credentialHash)
        console.log(privateKey)
      const  result= await vcController.createVc(did,credentialHash,privateKey)
      res.send(result)
    } catch (error) {
        next(error);
    }
           
});

router.post("/api/issuer/getVc",async (req, res,next) => {
    try{
        const did = req.body.did
        const privateKey = req.query.privateKey ? req.query.privateKey : process.env.PRIVATEKEY
      const  result= await vcController.getVc(did,privateKey)
      res.send(result)
    } catch (error) {
        next(error);
    }
           
});


router.post("/api/issuer/verifyVC",async (req, res,next) => {
    try{
        const did = req.body.did
        const privateKey = req.query.privateKey ? req.query.privateKey : process.env.PRIVATEKEY
        const vc = req.body.vc ? req.body.vc : null; 
        const credentialHash = await sdk.createVCHash(vc);
      const  result= await vcController.getVc(did,privateKey)
    console.log('-----------------------------------------')
    console.log(`credentialHash ${credentialHash}`)
    console.log('-----------------------------result----------------------')
    console.log(result)
      if (credentialHash == result.data){
        res.send("Verificaton Succesfull")
        
      }else{
        res.send("Verification Failed")
      }
    
    } catch (error) {
        next(error);
    }
           
});
router.post("/api/issuer/registerDid", async (req, res,next) => {
    try{
        const privateKey = req.query.privateKey ? req.query.privateKey : process.env.PRIVATEKEY
        const did = req.body.did
        console.log(privateKey)
        const token = await registerDID(did,privateKey);
        res.send(token);
    } catch (error) {
    next(error);
    }
   
});

router.delete("/api/issuer/deleteDid", async (req, res,next) => {
    try{
        const privateKey = req.query.privateKey ? req.query.privateKey : process.env.PRIVATEKEY
        const did = req.body.did

        const token = await deleteDidDoc(did,privateKey);
        res.send(token);
    } catch (error) {
        next(error);
        }
  
});

router.put("/api/issuer/updateDid", async (req, res,next) => {
    try{
        const privateKey = req.query.privateKey ? req.query.privateKey : process.env.PRIVATEKEY
        const did = req.body.did
        const didDoc= req.body.didDoc

        const response = await updateDidDoc(did,didDoc,privateKey);
        res.send(response);
    } catch (error) {
        next(error);
        }
  
});


router.post('/api/issuer/createSchema', async (req,res,next)=>{
    try {
        // loggerWeb.info(`Schema Details: ${JSON.stringify(req.body)}`);
        // const existSchema = await issuerController.getSchemaDetails(req.body.schemaName);
        // if(existSchema){
        //     throw createError(400,'Schema Creation Failed - Schema Already Exist');
        // }
        const jsonSchema = await schemaController.createSchema(req.body);
        res.status(201).json({success:true, data: jsonSchema, message: 'Schema created and submited successfully', status:201});
    } catch (error) {
        next(error);
    }
});


router.post('/api/user/register', async (req,res,next)=>{
    try {
        // loggerWeb.info(`Schema Details: ${JSON.stringify(req.body)}`);
        // const existSchema = await issuerController.getSchemaDetails(req.body.schemaName);
        // if(existSchema){
        //     throw createError(400,'Schema Creation Failed - Schema Already Exist');
        // }
        const jsonSchema = await userController.register(req.body);
        res.status(201).json({success:true, data: jsonSchema, message: 'User data added successfully', status:201});
    } catch (error) {
        next(error);
    }
});

router.post('/api/user/login', async (req,res,next)=>{
    try {
        // loggerWeb.info(`Schema Details: ${JSON.stringify(req.body)}`);
        // const existSchema = await issuerController.getSchemaDetails(req.body.schemaName);
        // if(existSchema){
        //     throw createError(400,'Schema Creation Failed - Schema Already Exist');
        // }
        const jsonSchema = await userController.login(req.body);
        res.status(201).json({success:true, data: jsonSchema, message: 'Resonse of user', status:201});
    } catch (error) {
        next(error);
    }
});


router.get('/api/issuer/schema/:schemaName', async (req,res,next)=>{
    try {
        loggerWeb.info(`Schema Name: ${req.params.schemaName}`);
        const jsonSchema = await schemaController.getSchemaDetails(req.params.schemaName);
        res.status(200).json({success:true, data: jsonSchema, message: `${jsonSchema ? 'Schema retrieved' : 'Schema does not exist' }`, status:200});
    } catch (error) {
        next(error);
    }
});

router.get('/api/issuer/schemas', async (req,res,next)=>{
    try {
        const jsonSchema = await schemaController.getAllSchemaDetails();
        res.status(200).json({success:true, data: jsonSchema, message: 'Schema collection retrieved', status:200});
    } catch (error) {
        next(error);
    }
});


router.post('/api/issuer/createVerifiableCredential', async (req,res,next)=>{ 
        try {
            //loggerWeb.info(`Credential Subject Details: ${JSON.stringify(req.body)}`);
            // const jsonSchema = await schemaController.getSchemaDetails(req.body.schemaName);
            // if(!jsonSchema){
            //     throw createError(400, 'Invalid Schema');
            // }
            //console.log(req.body.credentialSubject)

            const [verifiableCredData,vcToHash] = await vcController.createVerifiableCred(req.body.credentialSubject,{
                // documentType: req.body.schemaName,
                // schemaUrl: `${req.protocol}://${req.headers.host}/schema/${jsonSchema.schemaName}`,
                // schema: jsonSchema,
                userDid: req.headers.did? req.headers.did : null
                // expiration: jsonSchema.expiration ? moment().add(jsonSchema.expiration.value,jsonSchema.expiration.unit):null,
            });
            console.log(verifiableCredData)
            if(!verifiableCredData){
                throw createError(400,'Membership Document Creation Failed');
            }
          
            else{
                res.status(201).json({
                    success:true,
                    data: verifiableCredData,
                    hash: vcToHash,
                    message: 'Verifiable Credential created and submited successfully',
                    status:201});
            }
        } catch (error) {
            next(error);
        }
    })

module.exports  =router;