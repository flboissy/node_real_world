var assert = require('assert');
var User = require("../models/User");
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;


describe('User model', function(){

    describe('#validPassword', function(){
        it("should return true if password is good", function() {
            var usr = new User();
            usr.password = "azerty";
            usr.salt = "azerty";
            usr.hash = crypto.pbkdf2Sync(usr.password, usr.salt, 10000, 512, 'sha512').toString('hex');
            assert.equal(true, usr.validPassword("azerty"))          
        })

        it("should return false if password is not good", function(){
            var usr = new User();
            usr.password = "azerty";
            usr.salt = "azerty";
            usr.hash = crypto.pbkdf2Sync(usr.password, usr.salt, 10000, 512, 'sha512').toString('hex');
            assert.equal(false, usr.validPassword("toto"))    

        })
    })

    describe('#setPassword', function(){
        it("should set correctly the password of the user", function() {
            var usr = new User();
            usr.setPassword("azerty");
            assert.equal(true, usr.validPassword("azerty"));
        })
    })

    describe('#generateJWT', function(){
        it("Should generate a valid JWT" , function() {
            var usr = new User();
            usr._id = "1";
            usr.username = "Momo henni";
            var generatedToken = usr.generateJWT();
            assert.doesNotThrow(() => {jwt.verify(generatedToken,secret)})
        })
    })

    describe('#toAuthJSON', function(){
        it("Should geturn a valid JSON" , function() {
            var usr = new User();
            usr.generateJWT = ()=> {
                return jwt.sign({
                    id: this._id,
                    username: this.username
                }, "secret")
              
            }
            usr._id = "1";
            usr.username = "yolo";
            usr.email = "email@gmail.com";
            usr.bio = "La Bio";
            usr.image = "image";
            expectedToken = usr.generateJWT();
            var expectedResp = {
                username : "yolo",
                email : "email@gmail.com",
                token : expectedToken,
                bio : "La Bio",
                image : "image"
            }
            assert.equal(JSON.stringify(expectedResp), JSON.stringify(usr.toAuthJSON()));
        })
    })
})
