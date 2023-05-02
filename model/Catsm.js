const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const catSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  breed: { type: String, required: true },
  gender: { type: String, required: true },
  size: { type: String, required: true },
  weight: { type: Number, required: true },
  description: { type: String, required: true },
  intakeDate: { type: Date, required: true },
  imageUrl: { type: String, required: true },
  imageAltText: { type: String, required: true },
  specialNeeds: [specialNeedSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cat", catSchema);