const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const tokenAuth = require('../middleware/tokenauth');
const Post = mongoose.model("Post");


router.get('/allposts', tokenAuth, async (req, res) => {
    try {
        // populate is used to obtain the whole data related to the id provided
        const posts = await Post.find().populate('postedBy', '_id name').populate("comments.postedBy","_id name");
        res.json(posts);
    }
    catch (error) {
        res.json(error);
    }
});
// "post" for creating operations
router.post('/createpost', tokenAuth, async (req, res) => {
    const { title, body, photo } = req.body;

    if (!title || !body || !photo) {
        res.status(402).send("please provide the content");
    }
    console.log(req.user);
    // res.send("ok");
    // req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user
    });
    try {
        const result = await post.save();
        res.status(200).json(result);
    }
    catch (error) {
        res.send(error);
    }
});
//"get" for reading operations
router.get('/myposts', tokenAuth, async (req, res) => {
    try {
        const posts = await Post.find({ postedBy: req.user._id }).populate("postedBy", "_id name");
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(402).json(error);
    }
});

//"put" for updating operations 
router.put('/like',tokenAuth, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        // pushing an element in array 
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if (err) {
        return res.status(422).json({error:err})
        } else{
            res.json(result);
        }
    });
});

router.put('/unlike',tokenAuth, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        // popping element from array, it deletes all the occurences of the element
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if (err) {
        return res.status(422).json({error:err})
        } else{
            res.json(result);
        }
    });
});

router.put('/comment',tokenAuth, (req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        // pushing an element in array 
        $push:{comments:comment}
    },{
        new:true
    }).populate("comment.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if (err) {
        return res.status(422).json({error:err})
        } else{
            res.json(result);
        }
    });
});
// postId is the parameter passed through the post 
router.delete('/deletepost/:postId',tokenAuth, (req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec(async (err,post)=>{
        if (err || !post){
            return res.status(422).json({error:err});
        }
        // as id is ObjectId type so it will be better to compare in string format
        if (post.postedBy._id.toString() === req.user._id.toString()){
            try {
                const result = await post.remove();
                console.log(result);
                res.json(result);
            }
            catch(error){
                console.log(error);
            }
        }
    })
})

module.exports = router;