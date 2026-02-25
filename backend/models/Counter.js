const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  role: {
    type: String,
    unique: true
  },
  sequence: {
    type: Number,
    default: 1000
  }
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;