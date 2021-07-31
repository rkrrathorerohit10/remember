const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('./config/keys');
const tokenAuth = require('../middleware/tokenauth');
// this is how returning way of modules works... 
const User = mongoose.model("User");

router.get('/protected', tokenAuth, (req, res) => {
    res.send("Hello token");
});

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, photo } = req.body;
        if (!name || !email || !password) {
            res.status(402).json({ error: "please pass all the fields" });
        }

        if (await User.findOne({ email: email })) {
            return res.status(422).json({ error: "user already exists" });
        }
        else {
            const hashpwd = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                email,
                password: hashpwd,
                photo
            });
            const savedData = await user.save();
            console.log("registered successfully");
            res.status(200).json(savedData);
        }
    }
    catch (err) {
        res.status(402).json(error);
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(422).json({ error: "please provide all both details" });
        }
        const savedUser = await User.findOne({ email: email })
        if (savedUser) {
            const cmp = await bcrypt.compare(password, savedUser.password);
            if (cmp) {
                const token = await jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                res.json({ message: "logged in successfully", token: token, user: savedUser });
            }
            else {
                res.status(422).json({ error: "invalid email or password" });
            }
        }
        else {
            res.status(402).json({ error: "this email is not registered so please register first" });
        }
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;