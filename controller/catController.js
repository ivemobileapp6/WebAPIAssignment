const express = require("express")
const mongoClient = require("mongodb").MongoClient
const catsm = require("../model/catsm")
const userm = require("../model/userm")
const catsphotpm = require("../model/catsphotom")
const app = express();
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const catController = {

  // Add a cat 
  async addCat(req, res) {
    try {
      const imageUrl = req.file ? req.file.path : undefined;

      const {
        age, breed, gender, description
      } = req.body;

      const newCat = new catsm({
        age,
        breed,
        gender,
        description,
        photos: imageUrl ? [imageUrl] : [],
        createdAt: Date.now()
      });

      const savedCat = await newCat.save();

      res.status(201).json({ success: true, data: savedCat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while processing your request.', error: error.message });
    }
  },
  // Get a cat by its ID
  async getCatById(req, res) {
    try {
      const user = await userm.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        const catDetails = await catsm.find({ _id: { $in: user.favourites } });
        res.json(catDetails);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Update a cat by its ID
  async updateCatById(req, res) {

    try {

      const catId = req.params.id;
      console.log('Received request to update cat:', catId);

      const imageUrl = req.file ? req.file.path : undefined;

      const {
        age, breed, gender, description
      } = req.body;


      console.log('age:', req.body.age);
      console.log('breed:', req.body.breed);
      console.log('gender:', req.body.gender);
      console.log('description:', req.body.description);


      const updatedCat = await catsm.findByIdAndUpdate(catId, {
        age,
        breed,
        gender,
        description,
        ...(imageUrl ? { photos: [imageUrl] } : {}),
        updatedAt: Date.now(),
      }, { new: true });

      if (!updatedCat) {
        return res.status(404).json({ success: false, message: 'Cat not found' });
      }

      res.status(200).json({ success: true, data: updatedCat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while processing your request.', error: error.message });
    }
  },

  async getAllCats(req, res, next) {
    try {
      const cats = await catsm.find();
      res.send(cats);
    } catch (error) {
      res.status(500).send({ status: "Failed", "msg": "Failed to get cats" });
    }
  },

  // Remove a cat record in the database
  async removeCat(req, res) {
    const id = req.params.id;
    try {
      const result = await catsm.findByIdAndDelete(id);
      if (result) {
        res.send({ "Success": 'Removed a cat' });
      } else {
        res.status(404).send({ status: "Failed", message: "Cat not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(400).send({ status: "Failed", msg: "Failed to remove cat" });
    }
  },

  async addPhoto(req, res) {
    try {
      const cat = new catsphotpm({
        photo: req.file.path
      });
      const savedCat = await cat.save();
      res.status(201).send(savedCat);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }

  // async deletePhoto(req, res) {
  //   const photoId = req.params.id; 

  //   try {
  //     const catPhoto = await CatPhoto.findByIdAndRemove(photoId);

  //     if (!catPhoto) {
  //       return res.status(404).json({ message: 'Photo not found' });
  //     }

  //     // Delete the photo file from the 'uploads' directory
  //     fs.unlink(path.join(__dirname, '..', catPhoto.photo), (err) => {
  //       if (err) {
  //         console.error(`Error deleting file: ${err.message}`);
  //       }
  //     });

  //     res.status(200).json({ message: 'Photo deleted successfully' });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // }
}



module.exports = catController
