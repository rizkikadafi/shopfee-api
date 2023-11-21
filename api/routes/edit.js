var express = require('express');
var router = express.Router();
const pool = require('../db');
const multer = require('multer');

const upload = multer();


const { editCoffee } = require('../controller/coffee');
const requireLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.get('/', requireLogin, async (req, res) => {
  const coffeeId = req.query.id;
  const data = await pool.query('SELECT * FROM coffee WHERE coffee_id=$1', [coffeeId]);
  res.render('edit', { coffee: data.rows[0] });
})


router.post('/', requireLogin, upload.single('image'), editCoffee);

module.exports = router;
