const express = require("express");
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require("./db/database");
const cors = require("cors") // import cors
const {log} = require("mercedlogger") // import mercedlogger's log function
require("./middleware/auth") // Signup and login authentication middleware

const { PORT } = process.env;
const app = express();
db.connectToMongoDB();


//routes
const artRoute = require("./routes/articlesRoute");
const authRoute = require("./routes/auth");


// app.use(cors()) // add cors headers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', authRoute);
app.use('/blogs', artRoute);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/signup", (request, response) => {
    response.render("signup",);
})

app.get("/login", (request, response) => {
    response.render("login",);
})


// Handle errors.
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});

app.use (function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 400);
    res.json({error: err.message});
})


const server = app.listen(PORT, async () => await log.cyan("SERVER STATUS", `Listening on port ${PORT}`))
module.exports = server;