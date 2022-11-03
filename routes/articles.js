const express = require ("express");
const articleModel = require("../models/articles");
const articleRouter = express.Router();
const {readingTime} = require("./readTime")
const passport = require("passport");

// Post new blog
// functional
articleRouter.post("/", passport.authenticate("jwt", { session: false}), async (req, res) => {
    const article = await articleModel.create({
        title: req.body.title,
        description: req.body.description,
        body: req.body.body,
        tags: req.body.tags,
        id: req.user._id,
        author: user.firstName,
        reading_time: readingTime(req.body.body)
    });
    res.send(article);
})


// get blogs by author
//functional
articleRouter.get("/user/articles", passport.authenticate("jwt", { session: false}), (request, response) => {
    articleModel.find({"user": request.user})
    .select({title: 1})
    .then(articles => {
        response.status(200).send(articles)
    })
    .catch(err => {
        console.log(err)
        response.status(404).send({err: err.message});
    })
});


// get list of published blogs
// functional 
articleRouter.get('/published', async (request, response) => {
    const article = request.params.state
    await articleModel.find({state: "published"})
    .select({title: 1})
    .populate("author", {firstName: 1})
    .limit(20)
    .then(article => {
        response.status(200).send(article)
    })
    .catch(err => {
        console.log(err)
        response.send(err)
    })
});


// get all blogs
// functional
articleRouter.get("/", passport.authenticate("jwt", { session: false}), (request, response) => {
    articleModel.find()
    .select({title: 1})
    .populate("author", {firstName: 1})
    .limit(20)
    .then(articles => {
        response.status(200).json(articles)
    })
    .catch(err => {
        console.log(err)
        response.send(err)
    })
});


// get draft blogs
// functional
articleRouter.get("/draft", passport.authenticate("jwt", { session: false}), async (request, response) => {
    const article = request.params.state
    await articleModel.find({state: "draft"})
    .select({title: 1})
    .limit(20)
    .then(article => {
        response.status(200).send(article)
    })
    .catch(err => {
        console.log(err)
        response.send(err)
    })
});


//find blogs by tags
// functional
articleRouter.get('/tags/:tags', (request, response) => {
    const tags = request.params.tags
    articleModel.find({tags: tags})
    .select({title: 1})
    .then(tags => {
        response.status(200).send(tags)
    })
    .catch(err => {
        console.log(err)
        response.status(404).send(err)
    })
});


// get blogs by title
//functional
articleRouter.get("/title/:title", (request, response) => {
    const title = request.params.title
    articleModel.findOne({title: title})
    .select({title: 1})
    .then(title => {
        response.status(200).send(title)
    })
    .catch(err => {
        response.status(404).send(err)
    })
});


// update blog by id
//functional
articleRouter.patch("/update/:id", passport.authenticate("jwt", { session: false}), (request, response) => {
    const id = request.params.id
    const article = request.body
    article.lastUpdateAt = new Date()
    articleModel.findByIdAndUpdate(id, article, {new: true})
    .select({title: 1})
    .then(newArticle => {
        response.status(200).send(newArticle)
    }).catch(err => {
        console.loog(err)
        res.status(500).send(err)
    })
});


// delete blog by id
// functional
articleRouter.delete("/delete/:id", passport.authenticate("jwt", { session: false}), (request, response) => {
    const id = request.params.id
    articleModel.findByIdAndRemove(id)
    .then(article => {
        response.status(200).send("Blog deleted succesfully")
    })
    .catch(err => {
        console.log(err)
        response.status(500).send("Something went wrong")
    })
});


// get blog by id
// functional
articleRouter.get("/:id", (request, response) => {
    const id = request.params.id
    articleModel.findById(id)
    .then(article => {
        response.status(200).send(article)
    })
    .catch(err => {
        console.log(err)
        response.status(404).send(err)
    })
});

module.exports = articleRouter