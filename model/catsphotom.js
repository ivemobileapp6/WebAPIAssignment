const mongoose = require('mongoose');

const catsPhotoSchema = new mongoose.Schema({

  photo: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("catsPhotom", catsPhotoSchema);
