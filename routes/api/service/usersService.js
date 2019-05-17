var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.getUser = (req) => {
    return new Promise((resolve, reject) => {
        User.findById(req.payload.id)
        .then((user) => {
            if(!user){
                reject()
            }else{
                resolve({user : user.toAuthJSON()})
            }
        })
    })
}

exports.putUser = (req) => {
    return new Promise((resolve, reject) => {
        User.findById(req.payload.id)
            .then((user) => {
                if (typeof req.body.user.username !== 'undefined') {
                    user.username = req.body.user.username;
                }
                if (typeof req.body.user.email !== 'undefined') {
                    user.email = req.body.user.email;
                }
                if (typeof req.body.user.bio !== 'undefined') {
                    user.bio = req.body.user.bio;
                }
                if (typeof req.body.user.image !== 'undefined') {
                    user.image = req.body.user.image;
                }
                if (typeof req.body.user.password !== 'undefined') {
                    user.setPassword(req.body.user.password);
                }

                user.save().then(function () {
                    resolve({ user: user.toAuthJSON() });
                });

                user.save().then(() => {
                    resolve({ user: user.toAuthJSON() });
                })
            })
            .catch((err) => {
                reject(err);
            })
    })
}



checkIfUserIsCorrect = function (user) {
    isCorrect = true;
    if (!(typeof user.username !== 'undefined')) {
        isCorrect = false;
    }
    if (!(typeof user.email !== 'undefined')) {
        isCorrect = false
    }
    if (!(typeof user.bio !== 'undefined')) {
        isCorrect = false;
    }
    if (!(typeof user.image !== 'undefined')) {
        isCorrect = false;
    }
    if (!(typeof user.password !== 'undefined')) {
        isCorrect = false;
    }
    return isCorrect;
}


