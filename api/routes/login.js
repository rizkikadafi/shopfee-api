const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const pool = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  if(req.session && req.session.user) {
    res.redirect('/');
  }
  res.render('login');
});

router.post('/', async (req, res) => {
  res.set('Content-Type', 'application/json');
  try {
    const { username, password } = req.body;

    const admin = await pool.query('SELECT * FROM shopfee_admin WHERE username = $1', [username]);

    if (admin.rows.length < 1) {
      return res.json({ success: false, message: 'Admin tidak ditemukan' });
    }

    bcrypt.compare(password, admin.rows[0].password, (err, result) => {
      if (err) {
        console.error('Error comparing passwords:', err);
      } else {
        if (result) {
          req.session.user = {
            id: admin.rows[0].id,
            username: admin.rows[0].username
          }
          
          res.json({ success: true, message: 'Login berhasil' });
          // console.log('Password matches!');
        } else {
          res.json({ success: false, message: 'password salah' });
          // console.log('Password does not match!');
        }
      }
    });   

  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login' });
  }
});

module.exports = router;