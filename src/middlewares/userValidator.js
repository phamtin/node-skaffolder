const { schema } = require('../model/user/user.schema');

const updateMe = () => {
  return (req, res, next) => {
    const { error } = Joi.validate(req.body, schema.updateMe);
    if (error == null) return next();
    const { details } = error;
    const message = details.map((i) => i.message).join(',');

    return res.json(appError({ message }));
  };
};

module.exports = {
  updateMe,
};
