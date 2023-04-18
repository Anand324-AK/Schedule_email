const express = require("express");
const bodyParser = require("body-parser");
const nodeMailer = require("nodemailer")

const dotenv =  require("dotenv");
const mongoose = require("mongoose");
const app = express();

const emailRoute = require("./Routes/email")
dotenv.config();
app.use(bodyParser.json());

app.use('/api',emailRoute);

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('connected');
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.log(err)
    })