const functions = require("firebase-functions");
const express = require('express');
const router = express.Router();
const {bufferToBase64} = require("../file-process/file-process");

router.get('/hello-world', (req, res) => {
    res.status(200).json({message: 'Hello World'});
});

router.post('/upload-file', function(req, res) {
    functions.logger.info("uploaded files: "+ req.files, {structuredData: true});
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const file = req.files.file[0];

    const fileBase64 = bufferToBase64(file.buffer);

    //functions.logger.info("uploaded file: "+ bufferToBase64(fileBase64), {structuredData: true});

    console.log(file);

    res.status(200).json({data: fileBase64});
});

module.exports = router;