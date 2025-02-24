const mongoose = require("mongoose");

const mongo_URI = "mongodb://localhost:27017/chatify";

const connectToDb = () => {
  mongoose
    .connect(mongo_URI)
    .then(() => {
      console.log("Connected to Database Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = connectToDb;
