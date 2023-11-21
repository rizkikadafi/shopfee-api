var express = require('express');
var router = express.Router();
const multer = require('multer');
const { default: axios } = require('axios');
const pool = require('../db');
require('dotenv').config();

const upload = multer();

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

const uploadImage = async (apiKey, base64Image) => {
  const apiUrl = "https://freeimage.host/api/1/upload"

  const formData = new FormData();
  formData.append('key', apiKey);
  formData.append('source', base64Image);
  formData.append('format', 'json');

  try {
    const response = await axios.post(apiUrl, formData);
    // console.log(response.data);
    return response.data.image.url
  } catch (error) {
    console.error('Error uploading to FreeImageHost:', error);
    throw error;
  }

  
}

router.post('/', requireLogin, upload.single('image'), async (req, res, next) => {
  try {
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');

    const imageUrl = await uploadImage(process.env.IMAGE_HOST_API_KEY, base64Image);

    const query = `
    INSERT INTO coffee (name, description, rating, small_price, medium_price, large_price, image)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
    `

    let { 
      name, 
      description,
      rating, 
      small_price, 
      medium_price, 
      large_price, 
    } = req.body;

    rating = parseFloat(rating);
    small_price = parseInt(small_price);
    medium_price = parseInt(medium_price);
    large_price = parseInt(large_price);
    const values = [name, description, rating, small_price, medium_price, large_price, imageUrl];

    await pool.query(query, values);
    // res.json({ success: true, message: 'Data berhasil ditambahkan'});
    res.redirect('/');

  } catch (error) {
    console.error('Error adding coffee:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
