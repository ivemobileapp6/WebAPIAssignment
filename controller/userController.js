const mongoClient = require("mongodb").MongoClient
const userm = require("../model/userm")
const bcrypt = require("bcryptjs")
const Joi = require("@hapi/joi");
const { registerValidation } = require('../controller/validation');
const { loginValidation } = require('../controller/validation');
const JWT = require("jsonwebtoken")
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('284165840531-sbvorfpuclou0uledr9b0nqm8hnaodp6.apps.googleusercontent.com');


const userController = {

  async authGoogle(req, res) {

    const { id_token } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: '284165840531-sbvorfpuclou0uledr9b0nqm8hnaodp6.apps.googleusercontent.com',
      });

      const payload = ticket.getPayload();
      const email = payload.email;
      const name = payload.name;

      // Check if the user already exists in the database
      let user = await userm.findOne({ email });

      if (!user) {
        // If the user doesn't exist, create a new user
        user = new userm({
          name,
          email,
          userType: 'public', // Set default user type to 'public'
        });

        await user.save();


      }

      const token = JWT.sign({ _id: user._id, userType: user.userType, name: user.name }, process.env.TOKEN_SECRET, { expiresIn: "1h" });

      res.json({
        token: token,
        userId: user._id,
        googleId: payload.sub,
        name: user.name,
        email: user.email,
        userType: user.userType,
      });
    } catch (error) {
      res.status(400).json({ error: 'Invalid Google ID token' });
    }
  },

  // List out all the users in the database
  async getAllUser(req, res, next) {
    let users;
    try {
      users = await userm.find();
    } catch (err) {
      console.log(err);
    }
    if (!users) {
      return res.status(404).json({ message: "No Users Found" });
    }
    return res.status(200).json({ users });
  },

  // Add an user 

  async addUser(req, res) {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const emailExist = await userm.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Email already exists");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const { name, email, password, phonenumber, userType, staffKey } = req.body;
    //const mySecret = process.env['staffKey']; 
    //console.log(mySecret);
    if (userType === 'staff' && staffKey !== "123456") {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = new userm({
      name,
      email,
      password: hashedPassword,
      phonenumber,
      userType: userType || 'public',
    });
    try {
      const savedUser = await user.save();
      res.status(200).send({ user: savedUser._id });
    } catch (err) {
      res.status(400).send({ status: "Failed", msg: err });
    }
  },

  // Authenticate an user and return a Key

  // async auth(req, res) {
  //   const { error } = loginValidation(req.data);
  //   if (error) return res.status(400).send(error.details[0].message);
  //   const user = await userm.findOne({ name: req.body.name });
  //   if (!user) return res.status(400).send("Invalid Email");

  //   const validPass = await bcrypt.compare(req.body.password, user.password);
  //   if (!validPass) return res.status(400).send("Invalid Password");

  //   const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  //   res.send(token);
  // },

  async auth(req, res) {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    console.log('Searching for email:', req.body.email);
    const user = await userm.findOne({ email: req.body.email });
    console.log('User found:', user);

    // Debugging statements
    if (!user) {
      console.log('No user found. Checking all users in the database:');
      const allUsers = await userm.find({});
      console.log(allUsers);

      console.log('Checking the result when no email is provided:');
      const noEmailUser = await userm.findOne({ email: undefined });
      console.log(noEmailUser);
    }

    if (!user) return res.status(400).send("Invalid Email");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid Password");

    const token = JWT.sign({ _id: user._id, userType: user.userType, name: user.name }, process.env.TOKEN_SECRET, { expiresIn: "1h" });

    res.send({
      user: user,
      userId: user._id,
      token: token,
      name: user.name,
      userType: user.userType
    });
  },

  // async auth(req, res) {
  //   const { error } = loginValidation(req.data);
  //   if (error) return res.status(400).send(error.details[0].message);
  //   const user = await userm.findOne({ email: req.body.email });
  //   if (!user) return res.status(400).send("Invalid Email");

  //   const validPass = await bcrypt.compare(req.body.password, user.password);
  //   if (!validPass) return res.status(400).send("Invalid Password");

  //   // const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  //   // res.send(token);
  //   const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: "1m" });
  //     res.send(token);

  // },
  //   async auth(req, res) {
  //   const { error } = loginValidation(req.body);
  //   if (error) return res.status(400).send(error.details[0].message);

  //   const user = await userm.findOne({ name: req.body.name });
  //   if (!user) return res.status(400).send("Invalid Email");

  //   const validPass = await bcrypt.compare(req.body.password, user.password);
  //   if (!validPass) return res.status(400).send("Invalid Password");

  //   // Generate the JWT token using the generateToken function
  //   const token = generateToken(user);

  //   // Send the generated token in the response
  //   res.send(token);
  // },

  // Update an user's info 

  async addFavoriteCat(req, res) {
    try {
      const userId = req.body.userId;
      const catId = req.body.catId;

      const user = await userm.findByIdAndUpdate(
        userId,
        { $addToSet: { favourites: catId } }, // Update this line
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, message: 'Cat added to favourites', data: user.favourites }); // Update this line
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while updating favourites', error: error.message }); // Update this line
    }
  },

  async updateUser(req, res) {
    const salt = await bcrypt.genSalt(10);
    const upid = req.params.id;
    const updatedName = req.body.name;
    const updatedEmail = req.body.email;
    const favourites = req.body.favourites;
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const updatedPassword = hashedPassword
    await userm.findOneAndUpdate({ _id: req.params.id }, {
      $set: {
        name: updatedName, email: updatedEmail, password: hashedPassword,
        favourites: favourites
      }
    }).then(result => {
      res.status(200).json({
        updated: req.body
      })
    })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        })
      })
  },
  // Remove an user by ID

  async removeUser(req, res) {
    const id = req.params.id;
    try {
      const result = await userm.findByIdAndDelete(id);
      res.send({ "t": 'remove an user' });
    } catch (error) {
      res.status(400).send({ status: "Failed", "msg": "Failed to remove user" });
    }
  },
}
module.exports = userController
