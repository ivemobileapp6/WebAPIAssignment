const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const Route = require("./route/route");
// const UserRoute = require("./route/user");

mongoose.set('strictQuery', true)
mongoose.connect(
  "mongodb+srv://ivemobileapp6:Fra4rf5tg@cluster0.jgtwyji.mongodb.net/?retryWrites=true&w=majority").then(() => app.listen(10888)).then(() => console.log("Connected To Database")).catch((err) => console.log(err));

  // "mongodb+srv://ivemobileapp6:Fra4rf5tg@cluster0.tisbkgu.mongodb.net/?retryWrites=true&w=majority").then(() => app.listen(10888)).then(() => console.log("Connected To Database")).catch((err) => console.log(err));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use('/', Route)




//const mySecret = process.env['TOKEN_SECRET']
