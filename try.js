const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://amazon-product-details-amazone-data-scriping.p.rapidapi.com/product/B0BZYCJK89',
  params: {
    country: 'US',
    language: 'EN'
  },
  headers: {
    'x-rapidapi-key': '3bab928451msh6ed9e0fce363b61p140892jsnc3d7edbde81a',
    'x-rapidapi-host': 'amazon-product-details-amazone-data-scriping.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data[0].data.product_title);
	} catch (error) {
		console.error(error);
	}
}

fetchData();