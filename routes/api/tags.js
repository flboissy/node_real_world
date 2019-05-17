var router = require('express').Router();
var serviceTags = require('./service/serviceTags');

// return a list of tags
router.get('/', function(req, res, next) {
  serviceTags.getTags()
  .then((tags)=>{
    res.json(tags);
  })
  .catch(next);
});

module.exports = router;
