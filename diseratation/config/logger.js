// import log4js from 'log4js';
// import dotenv from 'dotenv';

const dotenv = require("dotenv");
const log4js = require("log4js");
dotenv.config();

log4js.configure({
  appenders: {
    web: {
      type: "dateFile",
      filename: "./public/logs/app.log",
      alwaysIncludePattern: true,
      pattern: "-yyy-MM-dd",
      keepFileExt: true,
      compress: true,
      daysToKeep: 7,
    },
    sdk: {
      type: "dateFile",
      filename: "./public/logs/app.log",
      alwaysIncludePattern: true,
      pattern: "-yyy-MM-dd",
      keepFileExt: true,
      compress: true,
      daysToKeep: 7,
    },
    error: {
      type: "dateFile",
      filename: "./public/logs/app.log",
      alwaysIncludePattern: true,
      pattern: "-yyy-MM-dd",
      keepFileExt: true,
      compress: true,
      daysToKeep: 7,
    },
    debug: {
      type: "dateFile",
      filename: "./public/logs/app.log",
      alwaysIncludePattern: true,
      pattern: "-yyy-MM-dd",
      keepFileExt: true,
      compress: true,
      daysToKeep: 7,
    },
  },
  categories: {
    webApp: { appenders: ["web"], level: "info" },
    debug: { appenders: ["debug"], level: "info" },
    error: { appenders: ["error"], level: "info" },
    default: { appenders: ["web"], level: "info" },
  },
});

exports.loggerWeb = log4js.getLogger("webApp");
// exports.loggerSDK = log4js.getLogger('hederaSDK');
exports.loggerError = log4js.getLogger("error");
exports.loggerDebug = log4js.getLogger("debug");
