function bufferToBase64(buffer) {
    return Buffer.from(buffer).toString('base64');
}
exports.bufferToBase64 = bufferToBase64;