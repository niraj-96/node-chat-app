const express = require('express');
const mongoose = require('mongoose');
const formidable = require('express-formidable');
const db = require('./config/database.config');
const cors = require('cors');
const { dburl } = require('./config/database.config');

const app = express();

const corsOptions = {
  origin: "https://angular-9-chat-app.web.app"
};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(cors(corsOptions));

//app.use(formidable());
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(dburl.url, {
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



