var mongoose = require('mongoose');
var Article = mongoose.model('Article');

/*
exports.getOneArticle = (slug) =>{
    return new Promise((resolve,reject)=>{
        Article.findOne({ slug: slug}).populate('author').then(function (article) {
            if (!article) { return res.sendStatus(404); }

            req.article = article;

            resolve(next());
        }).catch((err)=>{
            reject(err);
        });
    });
}

exports.getComment = (id) =>{
    return new Promise((resolve,reject)=>{
        Comment.findById(id).then(function(comment){
            if(!comment) { return res.sendStatus(404); }
        
            req.comment = comment;
        
            resolve(next());
        }).catch((err)=>{
            reject(err);
        });
    });
}*/

exports.getArticles = (req) =>{
    return new Promise((resolve,reject)=>{
        
        var query = {};
        var limit = 20;
        var offset = 0;

        if(typeof req.query.limit !== 'undefined'){
            limit = req.query.limit;
        }

        if(typeof req.query.offset !== 'undefined'){
            offset = req.query.offset;
        }

        if( typeof req.query.tag !== 'undefined' ){
            query.tagList = {"$in" : [req.query.tag]};
        }

        Promise.all([
            req.query.author ? User.findOne({username: req.query.author}) : null,
            req.query.favorited ? User.findOne({username: req.query.favorited}) : null
        ]).then(function(results){
            var author = results[0];
            var favoriter = results[1];

            if(author){
                query.author = author._id;
            }

            if(favoriter){
                query._id = {$in: favoriter.favorites};
            } else if(req.query.favorited){
                query._id = {$in: []};
            }

            return Promise.all([
                Article.find(query)
                    .limit(Number(limit))
                    .skip(Number(offset))
                    .sort({createdAt: 'desc'})
                    .populate('author')
                    .exec(),
                Article.count(query).exec(),
                req.payload ? User.findById(req.payload.id) : null,
            ]).then(function(results){
                var articles = results[0];
                var articlesCount = results[1];
                var user = results[2];

                resolve({
                    articles: articles.map(function(article){
                        return article.toJSONFor(user);
                    }),
                    articlesCount: articlesCount
                });
            });
        }).catch((err)=>{
            reject(err);
        });
    });
}

exports.getArticle = (req) =>{
    return new Promise((resolve,reject)=>{
        Promise.all([
            req.payload ? User.findById(req.payload.id) : null,
            req.article.populate('author').execPopulate()
        ]).then(function(results){
            var user = results[0];
            resolve({article: req.article.toJSONFor(user)});
        }).catch((err)=>{
            reject(err);
        });
    });
}


exports.updateArticle = (req) =>{
    return new Promise((resolve,reject)=>{
        User.findById(req.payload.id).then(function(user){
            if(req.article.author._id.toString() === req.payload.id.toString()){
                if(typeof req.body.article.title !== 'undefined'){
                    req.article.title = req.body.article.title;
                }

                if(typeof req.body.article.description !== 'undefined'){
                    req.article.description = req.body.article.description;
                }

                if(typeof req.body.article.body !== 'undefined'){
                    req.article.body = req.body.article.body;
                }

                if(typeof req.body.article.tagList !== 'undefined'){
                    req.article.tagList = req.body.article.tagList
                }

                req.article.save().then(function(article){
                    resolve({article: article.toJSONFor(user)});
                }).catch(next);
            } else {
                resolve(403);
            }
        }).catch((err)=>{
            reject(err);
        });
    });
}

exports.updateArticle = (req) =>{
    return new Promise((resolve,reject)=>{
        User.findById(req.payload.id).then(function(user){
            if (!user) { resolve(401); }

            if(req.article.author._id.toString() === req.payload.id.toString()){
                req.article.remove().then(function(){
                    resolve(204);
                });
            } else {
                resolve(403);
            }
        }).catch((err)=>{
            reject(err);
        });
    });
}

exports.favoriteAnArticle = (req) =>{
    return new Promise((resolve,reject)=>{

        var articleId = req.article._id;

        User.findById(req.payload.id).then(function(user){
            if (!user) { resolve(401); }

            user.favorite(articleId).then(function(){
                req.article.updateFavoriteCount().then(function(article){
                    resolve({article: article.toJSONFor(user)});
                });
            });
        }).catch((err)=>{
            reject(err);
        });
    });
}
  
exports.unfavoriteAnArticle = (req) =>{
    return new Promise((resolve,reject)=>{
  
        User.findById(req.payload.id).then(function (user){
            if (!user) { return resolve(401); }

            user.unfavorite(articleId).then(function(){
                req.article.updateFavoriteCount().then(function(article){
                    resolve({article: article.toJSONFor(user)});
                });
            });
        }).catch((err)=>{
            reject(err);
        });
    });
}

exports.getArticleComments = (req) =>{
    return new Promise((resolve,reject)=>{
  
    Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user){
            req.article.populate({
                path: 'comments',
                populate: {
                    path: 'author'
                },
                options: {
                    sort: {
                    createdAt: 'desc'
                    }
                }
            }).execPopulate().then(function(article) {
                resolve({comments: req.article.comments.map(function(comment){
                    return comment.toJSONFor(user);
                })});
            });
        }).catch((err)=>{
            reject(err);
        });   

        Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user){
            return req.article.populate({
              path: 'comments',
              populate: {
                path: 'author'
              },
              options: {
                sort: {
                  createdAt: 'desc'
                }
              }
            }).execPopulate().then(function(article) {
              return res.json({comments: req.article.comments.map(function(comment){
                return comment.toJSONFor(user);
              })});
            });
    });
}


  
exports.addNewComment = (req) =>{
    return new Promise((resolve,reject)=>{
        User.findById(req.payload.id).then(function(user){
            if(!user){ return resolve(401); }

            var comment = new Comment(req.body.comment);
            comment.article = req.article;
            comment.author = user;

            return comment.save().then(function(){
                req.article.comments.push(comment);

                return req.article.save().then(function(article) {
                    resolve({comment: comment.toJSONFor(user)});
                });
            });
        }).catch((err)=>{
            reject(err);
        });
    });
}

exports.deleteComment = (req) =>{
    return new Promise((resolve,reject)=>{
        if(req.comment.author.toString() === req.payload.id.toString()){
            req.article.comments.remove(req.comment._id);
            req.article.save()
            .then(Comment.find({_id: req.comment._id}).remove().exec())
            .then(function(){
                resolve(204);
            });
        } else {
            resolve(403);
        }
    }).catch((err)=>{
        reject(err);
    });
}

