const { buildJsonSchema } = require("../utils/jsonSchema");
const {
  createSchemaInTable,
  getSchemaByKey,
  getAllSchema,
} = require("../helper/schema.helper");
const dbHelper = require("../utils/dbHelper");
const {
  VerifiableCredential,
} = require("../models/verifiableCredentialSchema");
let dbflag = true;
const createtable = async () => {
  await dbHelper.createTables();
};

if (!dbflag) {
  createtable();
  dbflag = true;
}

const getSchemaDetails = async (schemaName) => {
  try {
    return await VerifiableCredential.find({
      "attributes.Item.schemaName": schemaName,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createSchema = async (schemaDetails) => {
  try {
    const jsonSchema = await buildJsonSchema(schemaDetails);
    const expiration = schemaDetails.expiration
      ? schemaDetails.expiration
      : null;
    await createSchemaInTable(jsonSchema, expiration, null);
    return jsonSchema;
  } catch (error) {
    return { error: error.message };
    throw new Error(error.message);
  }
};

const getAllSchemaDetails = async () => {
  try {
    return await getAllSchema();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createSchema,
  getSchemaDetails,
  getAllSchemaDetails,
};
