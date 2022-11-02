const mongoose = require("mongoose");
const userModel = require("./users")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ArticleSchema = new Schema ({
    id: ObjectId,
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        ref: "User"
    },
    state: {
        type: String,
        default: "draft",
        enum: ["published", "draft"]
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    lastUpdateAt: {
        type: Date,
        default: Date.now
    },
});


// export model
module.exports = mongoose.model("Article", ArticleSchema);
// const ArticleModel = mongoose.model("articles", ArticleSchema)
// module.exports = ArticleModel;

// app.get("/users", UserControls.all);
// app.get("/users/create", UserControls.create);
// app.get("/users/:first_name", UserControls.find);
// app.get("/users/:first_name/articles", UserControls.getAllArticles);

// app.get("/articles", ArticleControls.all);
// app.get("articles/:first_name/create", ArticleControls.create);
