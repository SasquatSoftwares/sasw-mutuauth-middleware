console.info(__dirname);
console.info(__filename);

const https = require('https');
const fs = require('fs');
const tls = require('tls');
const settings = require('./settings.json');
const logger = require('./logger.js');
const { decryptKey } = require('./encryption.js');
require('dotenv').config();

const license = fs.readFileSync("./license.key").toString();
const key = decryptKey(license, process.env.SECRETKEY_FOR_LICENSE);

const expiration = new Date(key);
if (new Date() > expiration) throw new Error('License expired');

const middlewareService = settings.middlewareService;
const destinationRoutes = settings.destinationRoutes;

const serverOptions = {
  cert: fs.readFileSync(middlewareService.certPath),
  key: fs.readFileSync(middlewareService.clientKeyPath),
  ca: fs.readFileSync(middlewareService.caBundlePath),
};

const server = https.createServer(serverOptions, (req, res) => {
  logger.info('Request started');

  let body = '';
  req.on('data', (data) => {
    logger.log('Data received');
    body += data;
  });

  req.on('end', () => {
    try {
      logger.log('Request done, relaying request to endpoint...');

      const matchingRoute = destinationRoutes.find((route) => req.headers.host.indexOf(route.originHostname) > -1);
      if (matchingRoute) {
        const { certFile, keyFile, caFile, originHostname, destinationHostname, destinationPort } = matchingRoute;
        let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        logger.info(`origin: ${clientIp}, from: ${req.headers.host}, to: ${destinationHostname}:${destinationPort}, route: ${req.url}`);
        const clientOptions = {
          hostname: destinationHostname,
          port: destinationPort,
          path: req.url,
          method: req.method,
          headers: req.headers,
          host: originHostname,
          cert: fs.readFileSync(certFile),
          key: fs.readFileSync(keyFile),
          ca: fs.readFileSync(caFile),
          requestCert: true,
          rejectUnauthorized: true,
        };

        //logger.info(clientOptions);

        const relayReq = https.request(clientOptions, (relayRes) => {
          let data = '';
          relayRes.on('data', (chunk) => {
            data += chunk;
          });
          relayRes.on('end', () => {
            try {

              logger.log(`Endpoint connection status code: ${relayRes.statusCode}`);
              //logger.log(`Endpoint response: ${data}`);
              res.statusCode = relayRes.statusCode;
              res.statusMessage = relayRes.statusMessage;
              res.httpVersion = relayRes.httpVersion;
              Object.keys(relayRes.headers).forEach((header) => {
                res.setHeader(header, relayRes.headers[header]);
              });
              res.end(data);

            } catch (error) {
              retransmitError(500, `Kentik Middleware: Erro ao finalizar procedimento de request no middleware: ${JSON.stringify(error)}`, res);
            }
          });
        });

        relayReq.on('error', (error) => {
          retransmitError(500, `Endpoint request error: ${JSON.stringify(error)}`, res)
        });

        relayReq.end(body);

      } else {
        retransmitError(404, `Kentik Middleware: hostname not found on settings: ${req.headers.host}`, res)
      }
    } catch (error) {
      retransmitError(500, `Kentik Middleware: Error on finish request: ${error}`, res)
    }
  });
});

function retransmitError(statusCode, msg, res) {
  res.statusCode = statusCode;
  logger.error(msg);
  res.end(msg);
}

server.listen(middlewareService.servicePort, () => {
  logger.log(`Service running on port ${middlewareService.servicePort}`);
});