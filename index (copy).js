const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const cors1 = require('express-cors');
const http = require('http');
const socketIO = require('socket.io');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const Route = require("./route/route");
// const UserRoute = require("./route/user");

mongoose.set('strictQuery', true)
mongoose.connect(
  "mongodb+srv://ivemobileapp6:Fra4rf5tg@cluster0.jgtwyji.mongodb.net/?retryWrites=true&w=majority")
  .then(() => server.listen(10888))
  .then(() => console.log("Connected To Database"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use('/', Route);

app.use(cors1({
  origin: 'https://webapifrontend.ivemobileapp6.repl.co',
  optionsSuccessStatus: 200  
}));

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const mySecret = process.env['TOKEN_SECRET']

