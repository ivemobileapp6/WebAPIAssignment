const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const catSchema = new Schema({
  age: { type: Number},
  breed: { type: String  },
  gender: { type: String },
  description: { type: String },
  photos: [{ type: String }],
});

module.exports = mongoose.model("catsm", catSchema);