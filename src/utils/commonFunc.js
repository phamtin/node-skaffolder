const { UPLOAD_TYPES } = require("./constants");

const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const isEmpty = (obj) =>
  Reflect.ownKeys(obj).length === 0 && obj.constructor === Object;

const pagination = (total, page = 1, limit = 20) => {
  return {
    total: total || 0,
    page,
    limit,
    offset: (page - 1) * limit,
    pages: !total
      ? 0
      : total % limit
      ? Math.floor(total / limit) + 1
      : total / limit,
  };
};

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

const getFileUrlByType = ({ type, placement, filename }) => {
  let path = null;
  switch (type) {
    //  Path implicily includes already the S3 bucket name: user-avatar
    //  path = `user-avatar/filename`;
    case UPLOAD_TYPES.USER_AVATAR: {
      path = "user-avatar" + filename;
      break;
    }
  }
  return path;
};

module.exports = {
  pagination,
  pick,
  catchAsync,
  isEmpty,
  getFileUrlByType,
};
