var express = require('express');
var router = express.Router();
const pool = require('../db');
const requireLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};


router.get('/', requireLogin, async (req, res) => {
  await pool.query("SELECT * FROM coffee", (error, results) => {
    if (error) throw error;
    res.render('index', { coffees: results.rows });
  })
});

module.exports = router;
