const CryptoJS = require("crypto-js");
const fs = require('fs');
require('dotenv').config();

function encryptMessage(message, secretKey) {
    const ciphertext = CryptoJS.AES.encrypt(message, secretKey);
    return ciphertext.toString();
}

// Usage:
const secretKey = process.env.SECRETKEY_FOR_LICENSE; // Use the 1st argument as the secret key
let date = new Date(process.argv[2]); // Use the 2nd argument as the message to encrypt
const days = new Number(process.argv[3]); // Use the 3nd argument as the number of days to specify de expiration date based on startDate
const outputPath = process.argv[4]; // Use the 3nd argument as the output file path

date.setDate(date.getDate() + days);
const message = date.toISOString();

const encryptedMessage = encryptMessage(message, secretKey);

// write the encrypted message to a file
fs.writeFileSync(outputPath, encryptedMessage);

console.log('Encrypted message written to file:', outputPath);
