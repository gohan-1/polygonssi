// import {findKey,forEach} from 'lodash';
// import {schemaRegex} from '../config/constants';
const {schemaRegex} = require('../config/constants')

exports.buildJsonSchema = (inputJson) => {
    try {
        const jsonSchema = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            title: inputJson.schemaName,
            description: inputJson.description,
            type: 'object',
            properties:{},
            required:[]
        };
        inputJson.attributes.forEach((attribute)=>{
            if(attribute.required){
                jsonSchema.required.push(attribute.attributeName);
            }
            jsonSchema.properties[attribute.attributeName] = {
                ...schemaRegex[attribute.type],
                description: attribute.description,
                maxLength: attribute.maxLength
            };
        });
        return jsonSchema;
    } catch (error) {
        throw new Error(error.message);
    }
};
