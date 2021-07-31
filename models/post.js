const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    comments:[{
        text:String,
        postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
    }],
    // now we will be building a relation b/w post and the poster by using object id of that person and User model
    postedBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
});

mongoose.model("Post", postSchema);