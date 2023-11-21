var express = require('express');
var router = express.Router();
const pool = require('../db');
const multer = require('multer');
const { default: axios } = require('axios');
require('dotenv').config();

const upload = multer();

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


router.post('/', requireLogin, upload.single('image'), async (req, res, next) => {
  let { 
    coffeeId,
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

  try {
    if(req.file != undefined) {
      const imageBuffer = req.file.buffer;
      const base64Image = imageBuffer.toString('base64');
  
      const imageUrl = await uploadImage(process.env.IMAGE_HOST_API_KEY, base64Image);
      const query = `
      UPDATE coffee SET 
      name = $1, 
      description = $2, 
      rating = $3,
      small_price = $4,
      medium_price = $5,
      large_price = $6,
      image = $7
      WHERE coffee_id = $8;
      `
      const values = [name, description, rating, small_price, medium_price, large_price, imageUrl, coffeeId];
      await pool.query(query, values);
    } else {
      try {
        console.log('update');
        const query = `
        UPDATE coffee SET 
        name = $1, 
        description = $2, 
        rating = $3,
        small_price = $4,
        medium_price = $5,
        large_price = $6
        WHERE coffee_id = $7;
        `
        const values = [name, description, rating, small_price, medium_price, large_price, coffeeId];
        await pool.query(query, values);
      } catch (error) {
        console.error('Error saat melakukan UPDATE:', error);
      }
    }

    // res.json({ success: true, message: 'Data berhasil ditambahkan'});
    res.redirect('/');

  } catch (error) {
    console.error('Error adding coffee:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
