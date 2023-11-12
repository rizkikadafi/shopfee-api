var express = require('express');
var router = express.Router();
const { getAllCOffee } = require('../controller/coffee');

/* GET home page. */
router.get('/', getAllCOffee);

module.exports = router;
