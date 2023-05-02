const mongoClient = require("mongodb").MongoClient
const Userm = require("../model/Userm")
const bcrypt = require("bcryptjs")
const Joi = require("@hapi/joi");
const { registerValidation } = require('../controller/validation');
const { loginValidation } = require('../controller/validation');
const JWT = require("jsonwebtoken")

const userController = {
  
  // List out all the users in the database
  async getAllUser(req, res, next) {
    let users;
    try {
      users = await Userm.find();
    } catch (err) {
      console.log(err);
    }
    if (!users) {
      return res.status(404).json({ message: "No Users Found" });
    }
    return res.status(200).json({ users });
  },

  // Add an user 

  async addUser1(req, res, next) {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const emailExist = await Userm.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Email already exists");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const { name, email, password } = req.body;
    const user = new Userm({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    try {
      const savedUser = await user.save();
      res.status(200).send({ user: savedUser._id });
    } catch (err) {
      res.status(400).send({ status: "Failed", msg: err });
    }
  },

  // Authenticate an user and return a Key
  
  async auth(req, res) {
    const { error } = loginValidation(req.data);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await Userm.findOne({ name: req.body.name });
    if (!user) return res.status(400).send("Invalid Email");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid Password");

    const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.send(token);
  },

  // Update an user's info 
  
  async updateUser(req, res) {
    const salt = await bcrypt.genSalt(10);
    const upid = req.params.id;
    const updatedName = req.body.name;
    const updatedEmail = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const updatedPassword = hashedPassword
    await Userm.findOneAndUpdate({ _id: req.params.id}, { $set: {name:updatedName,                                  email:updatedEmail,                                 password: hashedPassword                            }
  }).then(result=>{
      res.status(200).json({
        updated:req.body
      })
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })
},  
  // Remove an user by ID
  
  async removeUser(req, res) {
    const id = req.params.id;
    try {
      const result = await Userm.findByIdAndDelete(id);
      res.send({ "t": 'remove an user' });
    } catch (error) {
      res.status(400).send({ status: "Failed", "msg": "Failed to remove user" });
    }
  },
}
module.exports = userController