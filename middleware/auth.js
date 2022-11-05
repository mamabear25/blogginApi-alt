const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require ("../models/users");

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use("signup", new localStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const username = req.body.username;
            const gender = req.body.gender;
            const bio = req.body.bio;
            const user = await UserModel.create({ firstName, lastName, username, gender, bio, email, password });
            return done(null, user);
        } catch (error) {
            done(error);
        }
    }
));


passport.use("login", new localStrategy(
    {
        usernameField: "email",
        passwordField: "password"
    },
    async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });

            if (!user) {
                return done(null, false, { message: "User not found" });
            }
            const validUser = await user.isAuthenticated(password);

            if(!validUser) {
                return done(null, user, { message: "Wrong password"});
            }
            return done(null, user, {message: "login successful"});
        } catch (error) {
            return done(error);
        }
    }
));

