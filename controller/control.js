//REDIS-CLIENT probably only for testing
var {redisClient} = require("../model/redisClient");

var control = (function () {
  //PRIVATE METHODS
  
  return {
    //PUBLIC METHODS
    //Users
    newUser: (user) => {
      //create current-user cookie
    },
    removeUser: (user) => {
      //clear current-user cookie
    },
    
    //Rooms
    createRoom: (roomID) => {
      //create a messageList
    },
    getRoom: (roomID) => {
      var messageList;
      //get messageList
      //JSON stringify messageList
      return messageList;
    },
    
    //Messages
    createMessage: (roomID, user, message) => {
      //create JSON string of user and message
      //add it to the room list
    }
  };
})();

module.exports = {control};