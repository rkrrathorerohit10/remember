const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const {JWT_SECRET} = require('./config/keys');

const tokenAuth = (req, res, next) => {
    // console.log(req.headers.authorization);
    const {authorization} = req.headers;
    // console.log(authorization);
    if (authorization == undefined) {
        res.status(422).json({ error: "please sign in first." });
        // next();
    }
    const token = authorization //.replace("Bearer ","");
    jwt.verify(token, JWT_SECRET,async (err, payload) => {
        
        if (err) {
            res.status(401).json({ err: "please login first." });
        }

        const { _id } = payload;
        try {
        const result = await User.findOne({_id});
        req.user = result;
        next();
        }
        catch (error) {
            res.status(422).send(error);
        }
        // User.findOne({ _id }).then(result=>{
        //     req.user = result;
        //     next();
        // }).catch(error=>{
        //     res.status(422).json(error);
        // });
        
    });
    // putting next() here won't let update the res.user so we are putting it inside now.
}

module.exports = tokenAuth;