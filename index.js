const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs')
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'https://webapifrontend.ivemobileapp6.repl.co',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

const Route = require('./route/route');
const openApiDocument = YAML.load('./openapi.yaml');

mongoose
  .connect(
    'mongodb+srv://ivemobileapp6:Fra4rf5tg@cluster0.jgtwyji.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => server.listen(10888))
  .then(() => console.log('Connected To Database'))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/', Route);

const corsOptions = {
  origin: 'https://webapifrontend.ivemobileapp6.repl.co',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));


io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on('message', (msg) => {
    console.log('Message:', msg);
    io.emit('message', msg);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

});