require('dotenv').config();
const express = require('express');
const cors = require('cors');
const optimizeRoutes = require('./routes/optimize');

const app = express();
const PORT = process.env.PORT || 5001;

console.log('='.repeat(50));
console.log('[Server] Starting Amazon Optimizer Backend');
console.log('[Server] Environment:', process.env.NODE_ENV || 'development');
console.log('[Server] Port:', PORT);
console.log('[Server] Environment variables loaded:', {
  hasRapidApiKey: !!process.env.RAPIDAPI_KEY,
  hasOpenAiKey: !!process.env.OPENAI_API_KEY,
  hasDatabaseUrl: !!process.env.DATABASE_URL
});
console.log('='.repeat(50));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // Log response when it's finished
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${timestamp}] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    originalSend.call(this, data);
  };
  
  next();
});

app.use(cors());
app.use(express.json());

app.use('/api', optimizeRoutes);

app.get('/health', (req, res) => {
  console.log('[Server] Health check requested');
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`[Server] ✅ Server running on port ${PORT}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/health`);
  console.log(`[Server] API endpoint: http://localhost:${PORT}/api/optimize`);
});