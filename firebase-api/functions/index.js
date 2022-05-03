const functions = require("firebase-functions");
const express = require("express");

// create app using express framework
const app = express();

//requests
app.get('/hello-world', (req, res) => {
    res.status(200).json({message: 'Hello World'});
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
