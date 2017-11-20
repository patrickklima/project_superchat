//EXPRESS APP
const express = require('express');
const app = express();
const port = process.env.PORT;

//EXPRESS-HANDLEBARS
var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//CONTROLLER
var {control} = require('./controller/control');

//BODY-PARSER
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//COOKIE-PARSER
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//REDIS-CLIENT probably only for testing
// var {redisClient} = require("./model/redisClient");

//BOOTSTRAP
// const bootstrap = require('bootstrap');

//SOCKET.IO
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use('/socket.io',express.static(__dirname + 'node_modules/socket.io-client/dist/'));

io.on("connection", (socket) => {
  socket.on("new message", (data) => {
    console.log(data.roomID+" "+data.user+" "+data.message);
    control.createMessage(data.roomID, data.user, data.message)
    .then(() => {
    
      // socket.emit("data", )
    });
  });
});

//MIDDLEWARE AND RESOURCES
app.use(express.static(`${__dirname}/public`));

//ROUTES
const rooms = require('./routes/rooms-routes');
const users = require('./routes/users-routes');

app.use('/rooms', rooms);
app.use('/users', users);

//Presents the login form
app.get('/', (req, res) => {
  console.log("showing the login form");
  res.render('login');  
});

server.listen(port);