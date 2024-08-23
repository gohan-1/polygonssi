
const express = require("express");
// import  express from "express";
const mongoose = require('mongoose')
const swaggerJSDDOC =require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./public/logs/swagger/swagger.json');


const bodyParser = require("body-parser");
// let swaggerUi = require("swagger-ui-express");
// let swaggerDocument = require("./swagger.json");
const mainRouter = require("./routes/mainRouter");
// const VerifiableCredentialSchema = require('./models/verifiableCredentialSchema');
const port = process.env.PORT || 4200;

const app = express();

mongoose.connect('mongodb+srv://root:root@cluster0.ufadsm8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/certificate')


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(mainRouter);

app.listen(port, () => {
    console.log("Server running on port " + port);
});