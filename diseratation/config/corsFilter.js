// import cors from 'cors';
// import dotenv from 'dotenv';
const dotenv = require("dotenv")
const cors = require("cors")

dotenv.config();

const corsOption = {
    origin: process.env.ALLOWED_HOSTS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type','Authorization','Content-Length', 'X-Requested-With','X-API-KEY','x-api-key','did','publicKey','signature','privateKey'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

exports.corsFilter = cors(corsOption);
