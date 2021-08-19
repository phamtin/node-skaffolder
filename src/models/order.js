const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const STATUS = ['requested', 'created', 'canceled', 'processing', 'delivering'];

const orderSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: 'User', required: true },
    status: { type: String, enum: STATUS, required: true },
    price: { type: Number },
    suplies: { type: Array, default: [] },
    deletedAt: { type: Date, default: undefined }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
