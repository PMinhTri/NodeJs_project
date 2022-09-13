const express = require("express");
const mongoose = require("mongoose");
const auth = require('./route/auth');
const post = require('./route/post');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

const connectDB = async (uri) => {
  return mongoose
    .connect(uri)
    .then(() => {
      console.log("Connected to the DB...");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

const start = async () => {
  try{
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log('Server running on http://localhost:'+PORT));
  }catch(err){
    console.log(err);
  }
};

start();
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/posts', post);
