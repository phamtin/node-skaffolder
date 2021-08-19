const aws = require("aws-sdk");

const systemLog = require("../loaders/logger");
const config = require("../loaders/configs");

const removeImageFromS3 = async (param) => {
  const { filename } = param;
  const S3 = new aws.S3();

  const options = {
    Bucket: config.aws.bucket,
    Key: filename,
  };
  return await new Promise((resolve) => {
    systemLog.info(`Removing file ${filename} from S3`);
    S3.deleteObject(options, (err) => {
      if (err) return resolve(err);
      return resolve(true);
    });
  });
};

const getSignedUrl = async (params) => {
  systemLog.info("Create signed url - START");

  const S3 = new aws.S3();

  const options = {
    Bucket: config.aws.bucket,
    Key: params.filename,
    Expires: 300,
    ContentType: params.contentType,
  };
  return await new Promise((resolve) => {
    S3.getSignedUrl("putObject", options, function (err, url) {
      if (err) {
        systemLog.error(`Error in getSignedUrl = ${err}`);
        return resolve(err);
      }
      systemLog.info(`Create signed url - SUCCESS `);
      return resolve({ url });
    });
  });
};

module.exports = {
  getSignedUrl,
  removeImageFromS3,
};
