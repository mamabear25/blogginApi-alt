const express = require("express");
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require("./db/database");
const cors = require("cors") // import cors
const {log} = require("mercedlogger") // import mercedlogger's log function
require("./middleware/auth") // Signup and login authentication middleware
const user = require("./models/users")
const article = require("./models/articles")

//routes
const articlesRoute = require("./routes/articles");
const authRoute = require("./routes/auth");
const nosignupRouter = require("./routes/nosignup");

// const articleRouter = require("./routes/articles");

// const { db } = require("./db/database");
//connect to db
db.connectToMongoDB();

const app = express()
const { PORT } = process.env;

app.set('views', 'views');
app.set('view engine', 'ejs');


app.use(cors()) // add cors headers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use('/', authRoute);
// app.use("/published", nosignupRouter);
app.use('/blogs', articlesRoute);



app.get("/", (request, response) => {
    response.render("pages/index");
})


// Handle errors.
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});

app.listen(PORT, () => log.cyan("SERVER STATUS", `Listening on port ${PORT}`))