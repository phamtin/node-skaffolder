const { catchAsync, getFileUrlByType } = require("../utils/commonFunc");
const { S3service } = require("../services");
const AppError = require("../utils/appError");
const systemLog = require("../loaders/logger");

const getSignedUrl = catchAsync(async (req, res) => {
  const { photos } = req.body;
  const userId = req.user?.userId;

  const promises = photos.map(
    ({ filename, path = "cdn", contentType, type }) => {
      return new Promise(async (resolve, reject) => {
        const filePath = getFileUrlByType({
          type,
          placement: userId,
          filename,
        });
        const { url, error } = await S3service.getSignedUrl({
          filename: filePath,
          path,
          urlOnly: true,
          contentType,
        });
        if (error) return reject(new AppError(errors.SYSTEM_ERROR, 500));
        return resolve({ signedUrl: url, filePath });
      });
    }
  );

  const presignedUrls = await Promise.all(promises);
  systemLog.info(presignedUrls);
  return res.status(201).json(responseOK(presignedUrls));
});

module.exports = {
  getSignedUrl,
};
