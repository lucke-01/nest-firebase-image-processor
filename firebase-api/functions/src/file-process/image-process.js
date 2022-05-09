
//https://github.com/oliver-moran/jimp/issues/522
const Jimp = require("Jimp");

async function resizeImageFromFile(file, sizes) {
    const processedImages = [];
    let fileJimp = await Jimp.read(file.buffer);
    for (let size of sizes) {
        fileJimp = fileJimp.resize(size, Jimp.AUTO,Jimp.RESIZE_BILINEAR);
        const buffer = await fileJimp.getBufferAsync(file.mimetype);
        processedImages.push({size,buffer});
    }
    return processedImages;
}
module.exports.resizeImageFromFile = resizeImageFromFile;