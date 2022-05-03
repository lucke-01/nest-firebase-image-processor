const functions = require("firebase-functions");
const express = require("express");
const uploadFiles = require("./upload-file/upload-file-middleware");
const fs = require("fs");

// create app using express framework
const app = express();
const {bufferToBase64} = require("./file-process/file-process");

// fix to work with files in google cloud environment
uploadFiles('',app);

//requests
app.get('/hello-world', (req, res) => {
    res.status(200).json({message: 'Hello World'});
});

app.post('/upload-file', function(req, res) {
    functions.logger.info("uploaded files: "+ req.files, {structuredData: true});
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const file = req.files.file[0];

    const fileBase64 = bufferToBase64(file.buffer);

    functions.logger.info("uploaded file: "+ bufferToBase64(fileBase64), {structuredData: true});

    console.log(file);

    res.status(200).json({data: fileBase64});
    // Use the mv() method to place the file somewhere on your server
    /*file.mv('/somewhere/on/your/server/filename.jpg', function(err) {
      if (err)
        return res.status(500).send(err);
  
      res.send('File uploaded!');
    });*/
});

// we pass app to functions.https.onRequest to connect our express app with google firebase
exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  functions.logger.info("Hello logs!", {structuredData: true});
//  response.send("Hello from Firebase!");
// });
