const CryptoJS = require("crypto-js");
const fs = require('fs');

function decryptKey(ciphertext, secretKey) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

function encryptKey(message, secretKey) {
    const ciphertext = CryptoJS.AES.encrypt(message, secretKey);
    return ciphertext.toString();
}

module.exports = { decryptKey, encryptKey };