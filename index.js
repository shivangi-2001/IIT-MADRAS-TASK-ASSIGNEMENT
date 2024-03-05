require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const ejs = require('ejs-mate');
const bodyParser = require('body-parser');

const MaterialRoutes = require('./routes/routes');


// Database connection
const mongoose = require('mongoose');
const DB_URL =  'mongodb://127.0.0.1:27017/material';

mongoose.connect(DB_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(`MongoDB Database connected: ${DB_URL}`);
});


app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// servering the static files
app.use("/public", express.static(__dirname + "/public"));

// views -  Templates
app.engine('ejs', ejs)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// api routes
app.use('/', MaterialRoutes);


const port = process.env.PORT || 8000
app.listen(port, () => console.log(`listening in the port ${port} .....`))