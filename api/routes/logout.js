var express = require('express');
var router = express.Router();

const requireLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

router.get('/', requireLogin, async (req, res) => {
  if(req.session && req.session.user) {
    req.session.destroy((err) => {
      if(err) {
        return res.status(500).send('Error when logout');
      }
      res.clearCookie('session_id');
      res.redirect('/login');
    })
  }
})

module.exports = router;