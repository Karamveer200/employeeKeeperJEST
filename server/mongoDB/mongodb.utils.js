const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

//Drop collection function for Integration Tests
const dropCollection = async (collectionName) => {
  try {
    await mongoose.connection.collection(collectionName).drop();
  } catch (error) {
    if (error.code === 26) {
      console.log("Collection Not Found - ", collectionName);
    } else {
      throw new Error(error);
    }
  }
};

module.exports = {
  connect,
  disconnect,
  dropCollection,
};
