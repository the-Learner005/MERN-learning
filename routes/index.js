var express = require('express');
var router = express.Router();
var {requireAuth} = require('../middleware/auth.middleware');

/* GET home page. */
router.get('/', requireAuth, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
