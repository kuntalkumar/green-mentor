const mongoose = require("mongoose");

const connection = async () => {
  try {
    const mongoURI =
"mongodb+srv://kuntalkumar789:kuntal98@cluster0.vigwezr.mongodb.net/greenmentor";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err);
  }
};

module.exports = {
  connection,
};