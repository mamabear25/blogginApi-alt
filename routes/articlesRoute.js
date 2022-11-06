const express = require("express");
const passport = require("passport");

const {
    postBlog,
    getAllBlogsByAuthor,
    getpublishedBlogs,
    getAllBlogs,
    getDraft,
    getTags,
    getTitle,
    updateBlogById,
    deleteBlogById,
    getBlogById,
} = require ("../controller/articleController");


const blogRouter = express.Router();

blogRouter.post("/", passport.authenticate("jwt", { session: false}), postBlog);
blogRouter.get("/user/articles",  passport.authenticate("jwt", { session: false}), getAllBlogsByAuthor);
blogRouter.get("/published",  passport.authenticate("jwt", { session: false}), getpublishedBlogs);
blogRouter.get("/", getAllBlogs);
blogRouter.get("/draft",  passport.authenticate("jwt", { session: false}), getDraft);
blogRouter.get("/tags/:tags",  passport.authenticate("jwt", { session: false}), getTags);
blogRouter.get("/title/:title",  passport.authenticate("jwt", { session: false}), getTitle);
blogRouter.patch("/update/:id",  passport.authenticate("jwt", { session: false}), updateBlogById);
blogRouter.delete("/delete/:id",  passport.authenticate("jwt", { session: false}), deleteBlogById);
blogRouter.get("/:id", getBlogById);


module.exports = blogRouter
