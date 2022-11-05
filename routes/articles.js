const express = require ("express");
const articleModel = require("../models/articles");
const articleRouter = express.Router();
const {readingTime} = require("./readTime")
const passport = require("passport");
const userModel = require("../models/users");



// Post new blog
// functional
articleRouter.post("/", passport.authenticate("jwt", { session: false}), async (req, res) => {
    const article = await articleModel.create({
        title: req.body.title,
        description: req.body.description,
        body: req.body.body,
        tags: req.body.tags,
        author: req.user,
        reading_time: readingTime(req.body.body),
        read_count: req.body.read_count
    });
    res.send(article);
})


// get blogs by author
//functional
articleRouter.get("/user/articles", passport.authenticate("jwt", { session: false}), (request, response) => {
    articleModel.find({author: request.user})
    .select({title: 1})
    .limit(20)
    .then(articles => {
        response.status(200).send(articles)
    })
    .catch(err => {
        console.log(err)
        response.status(404).send({err: err.message});
    })
});


// get published blogs
// functional
articleRouter.get('/published', passport.authenticate("jwt", { session: false}), async (request, response) => {
    await articleModel.find({author: request.user},{state: "published"})
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


// get all blogs
// functional
articleRouter.get("/", async (request, response) => {
    await articleModel.find({state: "published"})
    .populate("author", {username: 1})
    .select({title: 1})
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
    await articleModel.find({author: request.user}, {state: "draft"})
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
articleRouter.get("/title/:title", async(request, response) => {
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
articleRouter.patch("/update/:id", passport.authenticate("jwt", { session: false}), async (request, response, next) => {
    const id = request.params.id
    const article = request.body
    const blogId = await articleModel.findById(id)
    if(!blogId)
    return response.status(404).json({
        message: "Article does not exist"
    });
    if (blogId.author != request.user._id) 
    return response.status(400).json({
        message: "Hey Blobber, you're not authorized to perform that action!"
    });
    article.lastUpdateAt = new Date()
    await articleModel.findByIdAndUpdate(id, article, {new: true} )
        .then(newArticle => {
            response.status(200).send(newArticle)
        }).catch(err => {
            console.log(err)
            response.status(500).send(err)
        })
    } 
);


// delete blog by id
// functional
articleRouter.delete("/delete/:id", passport.authenticate("jwt", { session: false}),async (request, response) => {
    const id = request.params.id
    const blogId = await articleModel.findById(id)
    if(!blogId)
    return response.status(404).json({
        message: "Article does not exist"
    });
    if (blogId.author != request.user._id) 
    return response.status(400).json("Hey Blobber, you're not allowed to delete another blobber's Article!");
    articleModel.findByIdAndRemove(id)
    .then(article => {
        response.status(200).send("Blog deleted succesfully")
    })
    .catch(err => {
        console.log(err)
        response.status(500).send(err)
    })
});


// get blog by id
// functional
articleRouter.get("/:id", async (request, response) => {
    const id = request.params.id
    const blogId = await articleModel.findById(id)
    if(!blogId)
    return response.status(404).json("Article does not exist");
    await articleModel.findByIdAndUpdate(id, {$inc: {read_count: 1}}, {new: true})
    .then(article => {
        response.status(200).send(article)
    })
    .catch(err => {
        console.log(err)
        response.status(500).send(err)
    })
});


module.exports = articleRouter