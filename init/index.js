if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/linking.js");

const MONGO_URL = process.env.ATLASDB_URL;
const path = require("path");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: "66a9ed39018e7cda08780156"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};
initDB();