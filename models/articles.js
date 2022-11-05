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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    state: {
        type: String,
        default: "draft",
        enum: ["published", "draft"]
    },
    reading_time: {
        type: String
    },
    read_count: {
        type: Number,
        default: 0
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

