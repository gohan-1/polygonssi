import joi from 'joi';
import joiDate from '@hapi/joi-date';
const Joi = joi.extend(joiDate);

// exports.didDocSchema = Joi.object().keys({
// });

// exports.verifiableCredentialSchema = Joi.object().keys({
//     '@context': Joi.array().items(Joi.string()).required(),
//     id: Joi.string().uri().required(),
//     type: Joi.array().items(Joi.string()).required(),
//     credentialSchema: Joi.object().keys({
//         id: Joi.string().uri().required(),
//         type: Joi.string().required()
//     }).required(),
//     issuer: Joi.string().required(),
//     credentialSubject: Joi.object().keys({
//         id: Joi.string().required(),
//         firstName: Joi.string().required(),
//         lastName: Joi.string().required(),
//         email: Joi.string().required(),
//         membershipType: Joi.string().required(),
//     }).required(),
//     issuanceDate: '2021-01-12',
//     expirationDate: '2021-01-12',
//     proof: Joi.object().keys({
//         type: Joi.string().required(),
//         creator: Joi.string().required(),
//         created: '2021-01-12',
//         proofPurpose: Joi.string().required(),
//         vcVerificationMethod: Joi.string().required(),
//         jws: Joi.string().required()
//     }).required(),
//     `credentialStatus`: Joi.string().required()
// });

exports.verifyVerifiableCredentialSchema = Joi.allow(null);

exports.retrieveDid = Joi.allow(null);
exports.getSchema = Joi.allow(null);

exports.createVerifiableCredentialSchema = Joi.object().allow(null);

exports.createSchema = Joi.object().keys({
    schemaName: Joi.string().alphanum().required(),
    description: Joi.string().required(),
    attributes: Joi.array().items(Joi.object().keys({
        attributeName: Joi.string().alphanum().required(),
        type: Joi.string().valid('alphabet', 'alphanumeric', 'email', 'date', 'number').required(),
        required: Joi.boolean().required(),
        description: Joi.string(),
        maxLength: Joi.string(),
    })).required(),
    expiration: Joi.object().keys({
        value: Joi.number().required(),
        unit: Joi.string().valid('years','months','days').required(),
    }).allow(null),
    dependantSchemas: Joi.array().items(Joi.string()).required(),
});
