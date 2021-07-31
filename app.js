require('dotenv').config();
const express = require('express');
const app = express();
// to handle the CORS policy ..... 
// const cors = require('cors');

// for creating connection 
const connecting = require('./routes/conn');
connecting();
// for importing created Schema
require('./models/user');
require('./models/post');

// app.use(cors());
// to parse the data passed by the body into JS object form. as we are passing the raw data from postman in json form. we have to use it before requiring the router, as we should convert our data before routing.
app.use(express.json());

// can use either of two ways mentioned below for routing 
// const router = require('./routes/auth');
// app.use(router);
// it will be routing all the requests made to the server.
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

const port = process.env.PORT || 5000;


// if it's deployed.. serve the static files 
if (process.env.NODE_ENV == "production"){
    app.use(express.static('remember/build'));
    const path = require('path');
    // if client will be making any request we will be sending index.html file, then there is the logic for further url params in our html file like profile or createpost ...
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'remember','build','index.html'));
    });
}


// server listening 
app.listen(port, ()=>{
    console.log(`running on port ${port}`);
});
