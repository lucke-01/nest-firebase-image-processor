const functions = require("firebase-functions");
const express = require('express');
const router = express.Router();
const {bufferToBase64} = require("../file-process/file-process");
const {resizeImageFromFile} = require("../file-process/image-process");

router.get('/hello-world', (req, res) => {
    res.status(200).json({message: 'Hello World'});
});

router.post('/resize-file', async function(req, res) {
    functions.logger.info("uploaded files: "+ req.files, {structuredData: true});
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    try {
      const file = req.files.file[0];
      
      //functions.logger.info("uploaded file: "+ bufferToBase64(fileBase64), {structuredData: true});

      const processedImages = await resizeImageFromFile(file, [1024, 800]);

      const processedImagesBase64 = processedImages.map(pi => ({...pi, buffer: bufferToBase64(pi.buffer)}));

      res.status(200).json({data: processedImagesBase64});
    } catch (err) {
      console.log(err);
      functions.logger.error(err);
      res.status(500).json({error: err.message});
    }
});

module.exports = router;