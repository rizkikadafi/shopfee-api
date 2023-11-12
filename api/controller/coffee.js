const pool = require('../db');

const getAllCOffee = (req, res) => {
  pool.query("SELECT * FROM coffee", (error, results) => {
    if (error) throw error;
    res.render('index', { coffees: results.rows });
  })
}

module.exports = {
  getAllCOffee
}