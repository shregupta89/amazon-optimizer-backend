const axios = require('axios');
const cheerio = require('cheerio');

async function fetchAmazonProduct(asin) {
  try {
    const url = `https://www.amazon.com/dp/${asin}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const $ = cheerio.load(response.data);

    const title = $('#productTitle').text().trim();
    
    const bullets = [];
    $('#feature-bullets ul li span.a-list-item').each((i, el) => {
      const text = $(el).text().trim();
      if (text) bullets.push(text);
    });

    let description = $('#productDescription p').text().trim();
    if (!description) {
      description = $('#aplus .aplus-module').text().trim();
    }

    if (!title || bullets.length === 0) {
      throw new Error('Failed to extract product details');
    }

    return {
      asin,
      title,
      bullets: bullets.join('\n'),
      description: description || 'No description available',
    };
  } catch (error) {
    throw new Error(`Failed to fetch Amazon product: ${error.message}`);
  }
}

module.exports = { fetchAmazonProduct };