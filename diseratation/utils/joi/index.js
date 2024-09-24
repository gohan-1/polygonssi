import joiSchema from "./joi.schema";

const schema = {
  GET: {
    "/api/issuer/did": joiSchema.retrieveDid,
    "/api/user/did": joiSchema.retrieveDid,
    "/api/organisation/did": joiSchema.retrieveDid,
    "/api/user/sign": joiSchema.retrieveDid,
    "/api/issuer/zkpCheck": joiSchema.retrieveDid,
  },
  POST: {
    "/api/issuer/verifiableCredential": joiSchema.retrieveDid,
    "/api/issuer/createSchema": joiSchema.retrieveDid,
    "/api/issuer/creatZkp": joiSchema.createSchema,
    "/api/verifier/verify": joiSchema.verifyVerifiableCredentialSchema,
  },
  DELETE: {},
  PUT: {},
};

export default schema;
