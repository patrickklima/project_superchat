const express = require('express');
const router = express.Router();
var {control} = require('../controller/control');


const CURR_USER_COOKIE_NAME = "current-user";

//Gets the new username and sets them as current-user with a cookie
router.post('/', (req, res) => {
  var user = req.body.username;
  control.newUser(user);
  res.cookie(CURR_USER_COOKIE_NAME, user);
  res.redirect('/rooms');
});

router.post('/:id', (req, res) => {
  //Logs out the user by clearing their current-user cookie
  var user = req.body.username;
  console.log(user);
  control.deleteUser(user);
  res.clearCookie(CURR_USER_COOKIE_NAME);
  res.redirect('/');
});

module.exports = router;