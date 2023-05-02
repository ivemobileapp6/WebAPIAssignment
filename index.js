const express = require("express");
const mongoose = require('mongoose');

const app = express();

const Route = require("./route/route");
// const UserRoute = require("./route/user");


const fetch = require("node-fetch")

mongoose.set('strictQuery', true)
mongoose.connect(
  "mongodb+srv://ivemobileapp6:Fra4rf5tg@cluster0.tisbkgu.mongodb.net/?retryWrites=true&w=majority").then(() => app.listen(10888)).then(() => console.log("Connected To Database")).catch((err) => console.log(err));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', Route)

const mySecret = process.env['TOKEN_SECRET']
npm ins