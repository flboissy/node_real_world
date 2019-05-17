var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var auth = require('../auth');
var serviceProfiles = require('./service/serviceProfiles');

// Preload user profile on routes with ':username'
router.param('username', function(req, res, next, username){
  User.findOne({username: username}).then(function(user){
    if (!user) { return res.sendStatus(404); }

    req.profile = user;

    return next();
  }).catch(next);
});

router.get('/:username', auth.optional, function(req, res, next){
  serviceProfiles.getProfile(req.profile, req.payload)
  .then((profile)=>{
    res.json(profile);
  });
});

router.post('/:username/follow', auth.required, function(req, res, next){
  serviceProfiles.postProfileFollow(req.profile, req.payload)
  .then((value) =>{
    if (value == 401) { resolve(value); }
    res.json(value);
  })
  .catch(next);
});

router.delete('/:username/follow', auth.required, function(req, res, next){
  serviceProfiles.deleteProfileFollow(req.profile, req.payload)
  .then((value)=>{
    if(value==401) { return res.json(value) }
    return res.json(value);
  })
  .catch(next);
});

module.exports = router;
