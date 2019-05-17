var assert = require('assert');
var Comment = require('../models/Comment');
var User = require('../models/User');
var Article = require('../models/Article');

describe('Comment Model', function(){
    describe('Method toJSONFor()', function(){
        it('it should return true if user is good', function(){
            var user = new User();
            var comment = new Comment();
            var article = new Article();

            user.password = "azerty";
            user.salt = "azerty";
            user.hash = crypto.pbkdf2Sync(usr.password, usr.salt, 10000, 512, 'sha512').toString('hex');

            article.slug = "azerty";
            article.title = "azerty";
            article.description = "azerty";
            article.body = "azerty";
            article.tagList = ["azerty", "tagList"];
            article.comments = [comment._id];
            article.author = user._id;

            comment.body = "test";
            comment.author = user._id;
            comment.article = article._id;

            assert.equal(true, comment.toJSONFor(user));
        });
    });
});