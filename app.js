const express = require("express");
const bodyParser = require("body-parser");

const dotenv =  require("dotenv");
const mongoose = require("mongoose");
const app = express();

dotenv.config();
const emailRoute = require("./Routes/email")
app.use(bodyParser.json());

app.use('/api',emailRoute);

//connecting to mongoDb

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('connected');
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.log(err)
    })