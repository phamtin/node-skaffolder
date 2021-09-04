const { ObjectId } = require('mongoose').Types;

const { ROLE } = require('../../src/utils/constants/index');

module.exports = {
  model: 'Role',
  documents: [
    {
      _id: new ObjectId('5e4d9c6684d71f1c7e2df5de'),
      name: ROLE.ADMIN,
      level: 1,
    },
  ],
};
