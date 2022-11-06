//import mongoose
const mongoose = require("mongoose");
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI

function connectToMongoDB() {
    mongoose.connect(MONGODB_URI);

    // pass the callback function once connected
    mongoose.connection.on("connected", () => {
        console.log("Blog-Api is connected to mongoDB");
    });

    mongoose.connection.on("error", (err) => {
        console.log("Unable to connect to the DB, please check your connections", err);
    })
}

module.exports = { connectToMongoDB };
