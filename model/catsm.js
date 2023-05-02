const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const catSchema = new Schema({
  age: { type: Number, required: true },
  breed: { type: String, required: true },
  gender: { type: String, required: true },
  size: { type: String},
  weight: { type: Number},
  description: { type: String, required: true },
  intakeDate: { type: Date, required: true },
  imageUrl: { type: String, required: true },
  imageAltText: { type: String },
  specialNeeds: [specialNeedSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("catsm", catSchema);