var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.getUser = (id) => {
    return new Promise((resolve, reject) => {
        User.findById(id)
        .then((user) => {
            if(!user){
                reject()
            }else{
                resolve({user : user.toAuthJSON()})
            }
        })
    })
}

exports.putUser = (id, userBody) => {
    return new Promise((resolve, reject) => {
        User.findById(id)
            .then((user) => {
                if (typeof userBody.username !== 'undefined') {
                    user.username = userBody.username;
                }
                if (typeof userBody.email !== 'undefined') {
                    user.email = userBody.email;
                }
                if (typeof userBody.bio !== 'undefined') {
                    user.bio =userBody.bio;
                }
                if (typeof userBody.image !== 'undefined') {
                    user.image = userBody.image;
                }
                if (typeof userBody.password !== 'undefined') {
                    user.setPassword(userBody.password);
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


