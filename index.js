//EXPRESS APP
const express = require('express');
const app = express();
const port = process.env.PORT;

//EXPRESS-HANDLEBARS
var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//CONTROLLER
var control = require('./controller/control');

//BODY-PARSER
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//COOKIE-PARSER
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//REDIS-CLIENT probably only for testing
// var {redisClient} = require("./model/redisClient");

//SOCKET.IO
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use('/socket.io',express.static(__dirname + 'node_modules/socket.io-client/dist/'));


//MIDDLEWARE AND RESOURCES
app.use(express.static(`${__dirname}/public`));



//ROUTING

//-- HOME DIRECTORY
//Presents the login form
app.get('/', (req, res) => {
  res.render('login');  
});

//Gets the new username and sets them as current-user with a cookie
app.post('/', (req, res) => {
  var user = req.body.username;
  control.newUser(user);
  res.redirect('/rooms', {user});
});

app.post('/:id', (req, res) => {
  //Logs out the user by clearing their current-user cookie
  var user = req.body.username;
  control.removeUser(user);
  res.redirect('/');
});

//-- ROOMS DIRECTORY
//Gets and posts messages for a room
app.get('/rooms/:roomID', (req, res) => {
  var roomID = req.params.roomID;
  var messageList = control.getRoom(roomID);
  res.render('rooms', {
    activeRoom: roomID,
    messages: messageList
  });
});

app.post('/rooms', (req, res) => {
  var newRoomID = req.body.roomID;
  control.createRoom(newRoomID);
  res.redirect('rooms/:newRoomID');
});

server.listen(port);