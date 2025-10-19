const axios = require('axios');

async function fetchAmazonProduct(asin) {

  const options = {
    method: 'GET',
    url: `https://amazon-product-details-amazone-data-scriping.p.rapidapi.com/product/${asin}`,
    params: {
        country: 'US',
        language: 'EN'
    },
    headers: {
        'x-rapidapi-key': '3bab928451msh6ed9e0fce363b61p140892jsnc3d7edbde81a',
        'x-rapidapi-host': 'amazon-product-details-amazone-data-scriping.p.rapidapi.com'
    }
    };


  const response = await axios.request(options);
  const data = response.data[0].data;

  const title = data.product_title || '';
  const description = data.product_description || 'No description available';
  const featureBullets = data.about_product || [];

  if (!title) {
    throw new Error('Product title not found');
  }

  const bullets = Array.isArray(featureBullets) 
    ? featureBullets.join('\n') 
    : featureBullets;

  return {
    asin,
    title,
    bullets,
    description,
  };
}

module.exports = { fetchAmazonProduct };