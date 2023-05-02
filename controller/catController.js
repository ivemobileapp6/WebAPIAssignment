const express = require("express")
const mongoClient = require("mongodb").MongoClient
const catsm = require("../model/catsm")
const app = express();
const fetch = require('node-fetch')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const catController = {

  // Get film data from the OMDB API
  getOMDB(req, res) {
    let filmName = req.params.keyword;
    console.log(req.params.keyword);
    let apiKey = "7a4156a5";
    fetch("https://www.omdbapi.com/?t=" + filmName + "&apikey=" + apiKey)
      .then(function(data) {
        return data.json();
      })
      .then(function(film) {
        console.log(film);
        res.send(film);
      });
  },

  // Add a cat 
  async addCat(req, res) {
    const { age, breed, gender, description, intakeDate, imageUrl } = req.body;
    const cat = new catsm({
      age: req.body.age,
      breed: req.body.breed,
      gender: req.body.gender,
      description: req.body.description,
      intakeDate: req.body.intakeDate,
      imageUrl: req.body.imageUrl,
    });
    try {
      const savedCat = await cat.save();
      res.status(200).send("cat is added")
    } catch (err) {
      res.status(400).send({ status: "Failed", msg: err })
    }
  },

// Get a cat based on id ----------------------------------------------------Need to check !!!!!!!!!!
async getCat(req, res) { // /cat (GET)
  const catId = req.params.id;
  try {
    const cat = await catsm.findById(catId);
    if (cat) {
      res.send(cat);
    } else {
      res.status(404).send({ status: "Failed", message: "Cat not found" });
    }
  } catch (err) {
    res.status(500).send({ status: "Failed", message: err.message });
  }
},

  // List all the cat in the database

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
  }
};
module.exports = catController
