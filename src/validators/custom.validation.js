const objectId = (value, helper) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helper.message('"{{#label}}" invalid mongo ID');
  }
  return value;
};

const password = (value, helper) => {
  if (value.length < 4) return helper.message('password must be at least 4 characters');

  return value;
};

module.exports = {
  objectId,
  password,
};
