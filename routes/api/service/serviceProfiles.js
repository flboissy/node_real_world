var mongoose = require('mongoose');
var User = mongoose.model('User');
var auth = require('../../auth');

exports.getProfile = (profile, payload) =>{
    return new Promise((resolve,reject)=>{
        if(payload){
            User.findById(payload.id).then(function(user){
              if(!user){ resolve({profile: profile.toProfileJSONFor(false)}); }
        
              resolve({profile: profile.toProfileJSONFor(user)});
            });
        } else {
            resolve({profile: profile.toProfileJSONFor(false)});
        }
    });
}

exports.deleteProfileFollow = (profile, payload) =>{
    return new Promise((resolve, reject) =>{
        var profileId = profile._id;

        User.findById(payload.id).then(function(user){
            if (!user) { resolve(401); }

            user.unfollow(profileId).then(function(){
                resolve({profile: profile.toProfileJSONFor(user)});
            });
        }).catch((err)=>{
            reject(err);
        });
    });
}

exports.postProfileFollow = (profile, payload) =>{
    return new Promise((resolve, reject) =>{
        var profileId = profile._id;

        User.findById(payload.id).then(function(user){
            if (!user) { resolve(401); }
    
            user.follow(profileId).then(function(){
                resolve({profile: profile.toProfileJSONFor(user)});
            });
        }).catch((err)=>{
            reject(err);
        });
    });
}
