const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { ObjectId } = mongoose.Types;

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    score: { type: Number, required: true },
    user: { type: ObjectId, ref: 'User', required: true },
    event: { type: ObjectId, ref: 'Event' },
  },
  { timestamps: true }
);

bookSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
