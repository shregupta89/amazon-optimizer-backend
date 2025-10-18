const { PrismaClient } = require('@prisma/client');
const { fetchAmazonProduct } = require('../services/amazonScraper');
const { optimizeListing } = require('../services/aiService');

const prisma = new PrismaClient();

async function optimizeProduct(req, res) {
  try {
    const { asin } = req.body;

    if (!asin) {
      return res.status(400).json({ error: 'ASIN is required' });
    }

    const original = await fetchAmazonProduct(asin);

    const optimized = await optimizeListing(original);

    const savedOriginal = await prisma.originalListing.create({
      data: {
        asin: original.asin,
        title: original.title,
        bullets: original.bullets,
        description: original.description,
      },
    });

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

    res.json({
      original: savedOriginal,
      optimized: savedOptimized,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getHistory(req, res) {
  try {
    const { asin } = req.params;

    const history = await prisma.originalListing.findMany({
      where: { asin },
      include: { optimized: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getLatestListing(req, res) {
  try {
    const { asin } = req.params;

    const latest = await prisma.originalListing.findFirst({
      where: { asin },
      include: { optimized: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!latest) {
      return res.status(404).json({ error: 'No listing found for this ASIN' });
    }

    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { optimizeProduct, getHistory, getLatestListing };