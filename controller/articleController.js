const articleModel = require("../models/articles");
const {readingTime} = require("../routes/readTime")
const server = require("../index");

// functional
const postBlog = async (req, res) => {
    const checkTitle = await articleModel.findOne({ title: req.body.title });
    if (!checkTitle)
    return res.status(400).json("Title exists, please choose a unique title");

    try {
        const article = new articleModel({
            title: req.body.title,
            description: req.body.description,
            body: req.body.body,
            tags: req.body.tags,
            author: req.user,
            reading_time: readingTime(req.body.body),
            read_count: req.body.read_count
        });
        const response = await article.save()
        return res.status(201).send(`Hi ${req.user.username}, Your blog is saved to draft, you can publish later!.`);
    } catch (error) {
        res.send(error);
    }
};

// functional
const getAllBlogsByAuthor = async (req, res) => {
    try {
        const paginatePage = 20;
        const blogs = await articleModel.find({author: req.user})
        .select({title: 1})
        .limit(paginatePage)
        .sort({read_count: 1, readingTime:-1,created_at:1, lastUpdateAt:1 })
        .skip(req.query.page ? (req.query.page - 1) * paginatePage : 0);
        res.status(200).send(blogs)
        if(!blogs)
        return res.status(404).json("Author has no published blogs")
    }
    catch (error) {
        res.send(error)
    }
};
     

// functional
const getpublishedBlogs = async (req, res) => {
    try {
        const blogs = await articleModel.find({state: "published"}, {author: req.user})
        .select({title: 1})
        .populate("author", {username: 1})
        .sort({read_count: 1, readingTime:-1,created_at:1, lastUpdateAt:1 })
        .limit(20)
        return res.status(200).send(blogs)
    }
    catch (error) {
        res.send(error)
    }
};


//functional
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await articleModel.find({state: "published"})
        .select({title: 1})
        .populate("author", {username: 1})
        .sort({read_count: 1, readingTime:-1,created_at:1, lastUpdateAt:1 })
        .limit(20)
        return res.status(200).send(blogs)
    }
    catch (error) {
        res.send (error)
    }
};

// functional
const getDraft = async (req, res) => {
    try {
        const article = await articleModel.find({author: req.user}, {state: "draft"})
        .select({title: 1})
        .sort({read_count: 1, readingTime:-1,created_at:1, lastUpdateAt:1 })
        .limit(20)
        return res.status(200).send(article)
    }
    catch (error) {
        res.send(error)
    }
};

// functional
const getTags = async (req, res) => {
    try {
        const tags = req.params.tags
        const article = await articleModel.find({tags: tags})
        .select({title: 1})
        .sort({read_count: 1, readingTime:-1,created_at:1, lastUpdateAt:1 })
        return res.status(200).send(article)
    }
    catch (error) {
        res.send(error)
    }
};

// functional
const getTitle = async (req, res) => {
    try {
        const title = req.params.title
        const article = await articleModel.find({title: title})
        .select({title: 1})
        .sort({read_count: 1, readingTime:-1,created_at:1, lastUpdateAt:1 })
        .populate("author", {username: 1})
        return res.status(200).send(article)
    }
    catch (error) {
        res.send(error)
    }
};

//functional
const updateBlogById = async ( req, res) => {
    try {
        const id = req.params.id
        const article = req.body
        const blogId = await articleModel.findById(id)
        if(!blogId)
        return res.status(404).json({
            message: "article does not exist"
        });
        if (blogId.author != req.user._id) 
        return res.status(400).json({
            message: "Hey Blobber, you're not authorized to perform that action!"
        });
        article.lastUpdateAt = new Date()
        await articleModel.findByIdAndUpdate(id, article, {new: true} )
        res.status(200).send(article)
    }
    catch (error) {
        res.send(error)
    }
};

// functional
const deleteBlogById = async (req, res) => {
    try {
        const id = req.params.id
        const blogId = await articleModel.findById(id)
        if(!blogId)
        return res.status(404).json({
            message: "article does not exist"
        });
        if (blogId.author != req.user._id) 
        return res.status(400).json("Hey Blobber, you're not authorized to perform that action!");
        await articleModel.findByIdAndDelete(id)
        res.status(200).send("Blog deleted successfully")
    }
    catch (error) {
        res.send(error)
    } 
};


//functional
const getBlogById = async (req, res) => {
    try {
        const id = req.params.id
        const blogId = await articleModel.findById(id)
        if(!blogId) 
        return res.status(404).json("Article does not exist");
        await articleModel.findByIdAndUpdate(id, {$inc: {read_count: 1}}, {new: true})
        res.status(200).send(blogId)
    }
    catch (error) {
        res.send(error)
    }
};


module.exports = {
    postBlog,
    getAllBlogsByAuthor,
    getpublishedBlogs,
    getAllBlogs,
    getDraft,
    getTags,
    getTitle,
    updateBlogById,
    deleteBlogById,
    getBlogById

}
