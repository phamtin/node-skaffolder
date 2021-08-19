const mongoose = require('mongoose');

const { ObjectId } = mongoose.SchemaTypes;

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, index: true },
  user: { type: ObjectId, ref: 'User', required: true },
  isPrimary: { type: Boolean, default: true },
  expires: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
