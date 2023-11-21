var express = require('express');
var router = express.Router();
const multer = require('multer');

const upload = multer();


const { addNewCoffee } = require('../controller/coffee');
const requireLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.get('/', requireLogin, (req, res) => {
  res.render('insert');
})


router.post('/', requireLogin, upload.single('image'), addNewCoffee);

module.exports = router;
