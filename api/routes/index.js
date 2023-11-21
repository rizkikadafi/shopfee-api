var express = require('express');
var router = express.Router();
const { getAllCOffee } = require('../controller/coffee');
const requireLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};


router.get('/', requireLogin, getAllCOffee);

module.exports = router;
