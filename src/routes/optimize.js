const express = require('express');
const { optimizeProduct, getHistory, getLatestListing } = require('../controllers/optimizeController');

const router = express.Router();

router.post('/optimize', optimizeProduct);
router.get('/history/:asin', getHistory);
router.get('/listings/:asin', getLatestListing);

module.exports = router;