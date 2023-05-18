const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const catSchema = new Schema({
  age: { type: Number},
  breed: { type: String  },
  gender: { type: String },
  //weight: { type: Number},
  description: { type: String },
  //intakeDate: { type: Date},
  imageUrl: { type: String },
  photos: [{ type: String }],
  //imageAltText: { type: String },
  //specialNeeds: { type: String },
  //createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("catsm", catSchema);