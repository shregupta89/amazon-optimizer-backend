const { PrismaClient } = require('@prisma/client');
const { fetchAmazonProduct } = require('../services/amazonScraper');
const { optimizeListing } = require('../services/aiService');

const prisma = new PrismaClient();

async function optimizeProduct(req, res) {
  const startTime = Date.now();
  console.log('[Controller] POST /api/optimize - Request received');
  
  try {
    const { asin } = req.body;
    console.log('[Controller] Request body:', { asin });

    if (!asin) {
      console.warn('[Controller] Validation failed: ASIN is missing');
      return res.status(400).json({ error: 'ASIN is required' });
    }

    console.log('[Controller] Step 1: Fetching Amazon product data...');
    const original = await fetchAmazonProduct(asin);
    console.log('[Controller] Step 1 complete: Product data fetched');

    console.log('[Controller] Step 2: Optimizing listing with AI...');
    const optimized = await optimizeListing(original);
    console.log('[Controller] Step 2 complete: Listing optimized');

    console.log('[Controller] Step 3: Saving original listing to database...');
    const savedOriginal = await prisma.originalListing.create({
      data: {
        asin: original.asin,
        title: original.title,
        bullets: original.bullets,
        description: original.description,
      },
    });
    console.log('[Controller] Original listing saved with ID:', savedOriginal.id);

    console.log('[Controller] Step 4: Saving optimized listing to database...');
    const savedOptimized = await prisma.optimizedListing.create({
      data: {
        originalId: savedOriginal.id,
        asin: original.asin,
        title: optimized.title,
        bullets: optimized.bullets,
        description: optimized.description,
        keywords: optimized.keywords,
      },
    });
    console.log('[Controller] Optimized listing saved with ID:', savedOptimized.id);

    const duration = Date.now() - startTime;
    console.log(`[Controller] Request completed successfully in ${duration}ms`);

    res.json({
      original: savedOriginal,
      optimized: savedOptimized,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[Controller] Error processing request:', {
      errorMessage: error.message,
      errorStack: error.stack,
      duration: `${duration}ms`
    });
    res.status(500).json({ error: error.message });
  }
}

async function getHistory(req, res) {
  console.log('[Controller] GET /api/optimize/history/:asin - Request received');
  
  try {
    const { asin } = req.params;
    console.log('[Controller] Fetching history for ASIN:', asin);

    const history = await prisma.originalListing.findMany({
      where: { asin },
      include: { optimized: true },
      orderBy: { createdAt: 'desc' },
    });

    console.log('[Controller] History retrieved:', {
      asin,
      recordCount: history.length
    });

    res.json(history);
  } catch (error) {
    console.error('[Controller] Error fetching history:', {
      errorMessage: error.message,
      errorStack: error.stack
    });
    res.status(500).json({ error: error.message });
  }
}

async function getLatestListing(req, res) {
  console.log('[Controller] GET /api/optimize/latest/:asin - Request received');
  
  try {
    const { asin } = req.params;
    console.log('[Controller] Fetching latest listing for ASIN:', asin);

    const latest = await prisma.originalListing.findFirst({
      where: { asin },
      include: { optimized: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!latest) {
      console.warn('[Controller] No listing found for ASIN:', asin);
      return res.status(404).json({ error: 'No listing found for this ASIN' });
    }

    console.log('[Controller] Latest listing retrieved:', {
      asin,
      listingId: latest.id,
      createdAt: latest.createdAt
    });

    res.json(latest);
  } catch (error) {
    console.error('[Controller] Error fetching latest listing:', {
      errorMessage: error.message,
      errorStack: error.stack
    });
    res.status(500).json({ error: error.message });
  }
}

module.exports = { optimizeProduct, getHistory, getLatestListing };