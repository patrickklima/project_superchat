const express = require('express');
const router = express.Router();
var {control} = require('../controller/control');

//Gets and posts messages for a room
router.get('/:roomID', (req, res) => {
  var roomID = req.params.roomID;
  console.log("roomID "+roomID);
  var messageList;
  control.getRoom(roomID)
  .then(mArr => {
    messageList = mArr;
    console.log("messageList");
    console.log(messageList);
    return control.getAllRooms();
  })
  .then(roomsArr => {
    console.log("roomID "+roomID);
    res.render('rooms', {
      currentRoom: roomID,
      messages: messageList,
      roomsList: roomsArr
    });
  });
});

//Loads the default room view and the list of rooms
const DEFAULT_ROOM = "general";
router.get('/', (req, res) => {
  var roomID = DEFAULT_ROOM;
  res.redirect(`/rooms/${roomID}`);
});

//Creates a new room
router.post('/', (req, res) => {
  var newRoomID = req.body.roomID;
  control.createRoom(newRoomID).then(() => {
    res.redirect(`/rooms/${newRoomID}`);
  });
});



module.exports = router;