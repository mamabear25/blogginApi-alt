const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const tagEverything = require("mongoose-tag-everything");
const { schema } = require("./articles");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema ({
    id: ObjectId,
    first_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    bio: {
        type: String,
        required: true,
        trim: true
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article"
    }],
    gender : {
        type: String,
        enum: ["male", "female", "other"],
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        lowercase: true
    },
});

UserSchema.pre("save", async function (next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
});

UserSchema.methods.isAuthenticated = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}

schema.plugin(tagEverything);
module.exports = mongoose.model('User', UserSchema); 
// const UserModel = mongoose.model("users", UserSchema)
// module.exports = UserModel;
