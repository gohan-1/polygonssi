
const vcHelper = require('./verifiableCredential.helper') ;
const {didConstants,messageConstants} = require ('../config/constants');
const {loggerSDK} = require ('../config/logger');



const createVC = (credentialSubject, vcParams) => {
    return new Promise((resolve, reject)=> {
    //console.log(credentialSubject, vcParams)    
        vcHelper.createVerifiableCred(credentialSubject, vcParams).then((verifiableCredential)=>{
            resolve(verifiableCredential);
        }).catch((error)=>{
            reject(error);
        });
    });
};

const createVCHash = async (verifiableCredential) => {
    return new Promise((resolve, reject)=>{
        vcHelper.vcToHash(verifiableCredential).then((hash)=>{
            if(hash){
                resolve(hash);
            }
            else{
                reject(new Error('Invalid Hash'));
            }
        }).catch((error)=> {
            reject(new Error(error.message));
        });
    });
};




module.exports = {
    createVC,
    createVCHash
};
