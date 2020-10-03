const express = require('express');
const mongoose = require('mongoose');
const formidable = require('express-formidable');
const db = require('./config/database.config');
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-with, Content-Type,Accept");
  next();
});


//app.use(cors());

app.use(formidable());
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(db.dburl, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


require('./routes/user.routes')(app);

const PORT = 3000;
const server = app.listen(process.env.port || PORT, console.log('Server started at port 3000'));

require('./routes/socket.routes')(server);



