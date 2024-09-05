const fs = require('fs');
const path = require('path');
const util = require('util');

const currentDate = new Date();

const year = currentDate.getFullYear().toString();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day = currentDate.getDate().toString().padStart(2, '0');
const hours = currentDate.getHours().toString().padStart(2, '0');
const minutes = currentDate.getMinutes().toString().padStart(2, '0');
const seconds = currentDate.getSeconds().toString().padStart(2, '0');

const dateTimeString = `${year}${month}${day}${hours}${minutes}${seconds}`;

const logPath = path.join(__dirname, 'logs');
if (!fs.existsSync(logPath)) throw `Log directory does not exist: ${logPath}`;

// Define the log file path
const logFilePath = path.join(__dirname, `logs/middleware-${dateTimeString}.log`);

// Create a writable stream for the log file
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Create a custom logger function
const logger = {
  log: (...args) => {
    const message = util.format(...args);
    console.log(message);
    logStream.write(`${Date.now().toFixed()} - ${message}\n`);
  },
  info: (...args) => {
    const message = util.format(...args);
    console.info(message);
    logStream.write(`${Date.now().toFixed()} - ${message}\n`);
  },
  error: (...args) => {
    const message = util.format(...args);
    console.error(message);
    logStream.write(`${Date.now().toFixed()} - ${message}\n`);
  },
};

module.exports = logger;