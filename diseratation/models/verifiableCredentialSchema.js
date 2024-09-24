const mongo = require("mongoose");

const Schema = mongo.Schema;

const certSchema = new Schema({
  attributes: {
    type: Array,
    required: true,
    unique: true,
  },
});

const VerifiableCredential = mongo.model("VerifiableCredential", certSchema);

module.exports = {
  VerifiableCredential,
};
