const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const tokenAuth = require('../middleware/tokenauth');
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get('/user/:id', tokenAuth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select("-password"); // we want the data without the password
        Post.find({ postedBy: req.params.id })
            .populate("postedBy", "_id name")
            .exec((err, posts) => {
                if (err) {
                    res.status(422).json({ error: err });
                }
                res.json({ user, posts });
            });
    } catch (error) {
        res.status(404).json({ error: "User not found" });
    }
})

router.put('/follow', tokenAuth, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, {
            new: true
        }).select("-password").then(result => {
            res.json(result);
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
});

router.put('/unfollow', tokenAuth, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, {
            new: true
        }).select("-password").then(result => {
            res.json(result);
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
});

router.put('/updatepic',tokenAuth,(req,res)=>{
    User.findByIdAndUpdate({_id:req.user._id},{
        $set:{
            photo:req.body.photo
        }
    },{
        new:true // to get the new updated object in result else it will send the old result
    },(err,result)=>{
        if (err){
            return res.status(422).json({error:err});
        }
        res.json(result);
    })
})

module.exports = router