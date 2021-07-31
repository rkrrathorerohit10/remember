const  mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"https://res.cloudinary.com/rohitrkr/image/upload/v1627719492/noimage_kywoyh.jpg"
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }]
});

// here we are just returning it rather than exporting it. so we will just require it normally rather than require it in a variable like below.
// so now we will be able to access it simply like an instance of it as app.models.User in requiring file
mongoose.model("User",userSchema);

// we can simply export the object of this schema as a model and require it in app.js file.
// but this way sometimes it shows error like you have imported this file their so we can't
// import here so to get rid of such error we are just returning it rather than exporting.
// const User = mongoose.model("User",userSchema);
// module.exports = User;

