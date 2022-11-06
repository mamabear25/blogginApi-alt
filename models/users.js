const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const tagEverything = require("mongoose-tag-everything");
const { schema } = require("./articles");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema ({
    id: ObjectId,
    firstName: {
        type: String,
        required: [true, "Please provide your First Name"],
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: [true, "Please provide your Last Name"],
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: [true, "Please provide a Username"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    bio: {
        type: String,
        required: [true, "Please write something about yourself, here's an example... I'm Danny, and I'm a cool guy!"],
        trim: true
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article"
    }],
    gender : {
        type: String,
        required: [true, "Please provide your gender"],
        enum: ["male", "female", "other"],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please provide a strong password"],
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
