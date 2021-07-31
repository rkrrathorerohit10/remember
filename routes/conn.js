const mongoose = require('mongoose');
const {MONGOURI} = require('./config/keys');
const connecting = async () =>{
    try {
        await mongoose.connect(MONGOURI, {
            useCreateIndex:true,
            useFindAndModify:true,
            useNewUrlParser:true,
            useUnifiedTopology:true
        });

        console.log("connection succesful");
    } catch (error) {
        console.log(error);
    }
}
module.exports = connecting;