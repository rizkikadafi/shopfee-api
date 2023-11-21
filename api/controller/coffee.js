const { default: axios } = require('axios');
const pool = require('../db');
const { response } = require('../app');
require('dotenv').config();

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

const getAllCOffee = (req, res) => {
  pool.query("SELECT * FROM coffee", (error, results) => {
    if (error) throw error;
    res.render('index', { coffees: results.rows });
  })
}

const addNewCoffee = async (req, res, next) => {
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
}

const editCoffee = async (req, res, next) => {
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
}
module.exports = {
  getAllCOffee,
  addNewCoffee,
  editCoffee
}