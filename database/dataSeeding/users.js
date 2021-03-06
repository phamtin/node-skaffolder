/**
 *  Add field xxx for User table.
 *  Date: 04/09/2021
 */
async function migrateIsDeleteField(userIds) {
  const User = _model('User');
  return await User.updateMany({ _id: { $in: userIds } }, { $set: { isDelete: false } });
}

module.exports = {
  migrateIsDeleteField,
};
