const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  numberOfSeats: { type: Number, required: true },
  amenities: { type: [String], required: true },
  pricePerHour: { type: Number, required: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model('Room', roomSchema);
