const crypto = require('crypto');

const systemLog = require('../loaders/logger');

const doST = (req, res, next) => {
  console.log('DO SOMETHING');

  const algorithm = 'aes-256-cbc';

  // generate 16 bytes of random data
  const initVector = crypto.randomBytes(16);
  systemLog.info({ initVector });

  // protected data
  const message = 'This is a secret message';

  // secret key generate 32 bytes of random data
  const Securitykey = crypto.randomBytes(32);
  systemLog.info({ Securitykey });

  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  // encrypt the message
  // input encoding
  // output encoding
  let encryptedData = cipher.update(message, 'utf-8', 'hex');

  encryptedData += cipher.final('hex');

  // the decipher function
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf8');

  console.log({ encryptedData, decryptedData });

  res.send('DID SOMETHING');
};

module.exports = { doST };
