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

router.delete('/', requireLogin, async (req, res) => {
  const coffeeId = req.query.id;
  try {
    await pool.query("DELETE FROM coffee WHERE coffee_id=$1", [coffeeId]);
    res.json({'success': true, 'message': 'data berhasil dihapus'});
  } catch (error) {
    res.json({'success': false, 'message': error});
  }

})

module.exports = router;
