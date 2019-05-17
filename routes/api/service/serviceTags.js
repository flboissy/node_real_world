var mongoose = require('mongoose');
var Article = mongoose.model('Article');


exports.getTags = () =>{
    return new Promise((resolve,reject)=>{
        Article.find().distinct('tagList').then(function(tags){
            resolve({tags: tags});
        }).catch((err)=>{
            reject(err);
        });
    });
}
