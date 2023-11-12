const  express = require('express');
const router = express.Router();
const { getAllCoffee } = require('../controller/coffee')
const pool = require('../db');

router.get('/', async function(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM coffee');
    res.json(result.rows);
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;