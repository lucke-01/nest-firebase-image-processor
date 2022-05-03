const express = require("express");
const uploadFiles = require("../upload-file/upload-file-middleware");
const routesFileProcess = require("../controller/files-process.controller");

// create app using express framework
const app = express();

// fix to work with files in google cloud environment
uploadFiles('',app);

//requests
app.use('/file-process/',routesFileProcess);

exports.app = app;