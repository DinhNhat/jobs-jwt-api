const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = (url) => {
  return mongoose.connect(url, {
    authSource: "portfolio", 
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB;
