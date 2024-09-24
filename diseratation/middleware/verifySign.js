// import sdk from '../sdk';
// import {verifyJwt} from '../utils/keysHelper';
// // import {verifyTemplates} from '../utils/tech5Integration';

// exports.verifySign = async (req, res, next) => {
//     try {
//         if(req.header('publicKey') && req.header('signature')){
//             const did = await sdk.retrieveDid();
//             const verifiedMessage = await verifyJwt(req.header('publicKey'),req.header('signature'), {
//                 audience:did,
//                 exp: Date.now()
//             });
//             res.locals.verifiedMessage = verifiedMessage;
//             // if(req.body.biometric){
//             //     const verifiedDetails = await verifyMBAP(req.body.biometric);
//             //     if(!verifiedDetails.verificationResult){
//             //         throw new Error(`Faces don't match the score percent is ${verifiedDetails.scorePercent} and match score is ${verifiedDetails.matchScore}`);
//             //     }
//             // }
//         }
//         next();
//     } catch (error) {
//         console.log(error);
//         next(new Error(`User Authentication Failed - ${error.message}`));
//     }
// };
