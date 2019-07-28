const mongoose = require('mongoose');
const passport = require('passport');
const config = require('../core/config/keys');
require('../middlewares/passportOauth')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/user");

router.post('/signup', (req, res)=> {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      privateKey: req.body.privateKey,
      role:"USER"
      });
      // save the user
    newUser.save((err) =>{
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/signin', (req, res)=> {
  User.findOne({
    username: req.body.username
  }, (err, user)=> {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
        user.comparePassword(req.body.password,  (err, isMatch)=> {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user, config.passport.secret, {
              expiresIn: 86400 // 1 day
            });
            // return the information including token as JSON
            res.json({success: true, token: token, user:user});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
    }
  });
});

getToken =  (headers)=> {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
