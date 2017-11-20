//REDIS-CLIENT
var {redisClient} = require("../model/redisClient");

var control = (function () {
  //PRIVATE METHODS
  const USER_KEY = "user";
  const MESSAGE_KEY = "body";
  
  var _getUniques = (arr) => {
  //from: https://coderwall.com/p/nilaba/simple-pure-javascript-array-unique-method-with-5-lines-of-code
    return arr.filter(function (value, index, self) { 
      return self.indexOf(value) === index;
    });
  };

  return {
    //PUBLIC METHODS
    
    //Rooms
    createRoom: (roomID) => {
      //create a messageList
      console.log("control.createRoom "+roomID);
      return control.createMessage(
        roomID,   //will be toLowerCase()ed in createMessage
        'SuperBot', 
        `Welcome to the new chat room: ${roomID}`
      );
    },
    getRoom: (roomID) => {
      console.log("control.getRoom "+roomID);
      //get messageList
      var messageList = [];
      return new Promise((resolve, reject) => {
        redisClient.keys(`${roomID}:*`, (err, keys) => {
          if (err) return reject(err);
          resolve(keys);
        });
      }).then(keysArr => {
        console.log(keysArr);
        var arrayOfKeys = keysArr
        .sort((a,b) => {
          console.log(parseInt(a.split(':')[1],10));
          console.log(parseInt(b.split(':')[1],10));
          return parseInt(a.split(':')[1],10) - parseInt(b.split(':')[1],10); //splitting away roomID to sort on timestamp
        });
        console.log(arrayOfKeys);
        return arrayOfKeys;
      }).then(msgKeys => {
        console.log(msgKeys);
        msgKeys.forEach(key => {
          console.log("key: "+key);
          redisClient.hmget(key, USER_KEY, MESSAGE_KEY, (err, msg) => {
            if (err) return err;
            console.log("msg: ");
            console.log(msg);
            messageList.push({
              [USER_KEY]: msg[0],
              [MESSAGE_KEY]: msg[1]
            });
          });
        });
        // console.log(messageList);
        return messageList;
      });
    },
    
    getAllRooms: () => {
      var prAllRooms = new Promise((resolve, reject) => {
        redisClient.keys('*', (err, roomsArr) => {
          if (err) return reject(err);
          //split away the timestamp, leaving only roomID
          roomsArr = roomsArr.map(x => (x.split(':')[0]));
          roomsArr = _getUniques(roomsArr);
          resolve(roomsArr);  
        });
      });
      return prAllRooms;
    },
    
    //Messages
    createMessage: (roomID, user, message) => {
      //create key string of user and message
      //key is roomID:timestamp
      return new Promise((resolve, reject) => {
        redisClient.time((err, time) => {
          if (err) return reject(err);
          resolve(time[0]);           //getting only unix time in seconds
        });
      }).then(time => {
        roomID = roomID.toLowerCase();
        return `${roomID}:${time}`;   //concatenating roomID and timestamp
      }).then(key => {                //key is roomID:timestamp
      //store message
        return redisClient.hmset(key, USER_KEY, user, MESSAGE_KEY, message, (err, result) => {
          if (err) return err;
          return result;
        });
      });
    },
    
    //Users
    newUser: (user) => {
      //create current-user cookie
      console.log("control.newUser "+user);
    },
    deleteUser: (user) => {
      //clear current-user cookie
      console.log("control.deleteUser "+user);
    }
  };
})();

module.exports = {control};



      // console.log("control.getRoom "+roomID);
      // //get messageList
      // var prMessageList = new Promise((resolve, reject) => {
      //   redisClient.lrange(roomID, 0, -1, (err, list) => {
      //     if (err) return reject(err);
      //     resolve(list);
      //   });
      // });
      // //JSON stringify messageList
      // return prMessageList.then(messagesArr => {
      //   var messageList = messagesArr.map(JSON.stringify);
      //   return Promise.all(messageList);
      // });
      
// return msgKeys.forEach(key => {
//           console.log("key: "+key);
//           redisClient.hmget(key, USER_KEY, MESSAGE_KEY, (err, msg) => {
//             if (err) return err;
//             console.log("msg: ");
//             console.log(msg);
//             messageList.push({
//               [USER_KEY]: msg[0],
//               [MESSAGE_KEY]: msg[1]
//             });
//             console.log(messageList);
//             messageList;
//           });      