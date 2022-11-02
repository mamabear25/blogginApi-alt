const express = require ("express");
const articles = require("../models/articles");
const articleModel = require("../models/articles")

const nosignupRouter = express.Router()



//endpoint for getting all blogs
nosignupRouter.get("/new", async (request, response) => {
    const article = request.params.state
    await articleModel.find({state: "published"})
    .then(article => {
        response.status(200).send(article)
    })
    .catch(err => {
        console.log(err)
        response.send(err)
    })
});

module.exports = nosignupRouter