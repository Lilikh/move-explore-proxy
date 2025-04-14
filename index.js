const express = require('express');
const axios = require('axios');
const app = express();

console.log('Starting proxy server...');

const API_KEY = process.env.VITE_API_KEY;
const BASE_URL = 'http://www.omdbapi.com/';

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
console.log('Express middleware set up');

// Test route to confirm routing works
app.get('/test', (req, res) => {
  console.log('Received request for /test');
  res.status(200).json({ message: 'Test route working' });
});

app.get('/api/proxy', async (req, res) => {
  const { s, i } = req.query;

  console.log('Received request for /api/proxy');
  console.log('Query parameters:', req.query);
  console.log('Proxy Environment:', { API_KEY, BASE_URL });

  if (!API_KEY) {
    console.log('API_KEY not set');
    return res.status(500).json({ error: 'API_KEY not set' });
  }

  try {
    const url = s
      ? `${BASE_URL}?s=${s}&apikey=${API_KEY}`
      : `${BASE_URL}?i=${i}&apikey=${API_KEY}`;
    console.log('Proxy fetching from:', url);
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Movie-Explore-Proxy/1.0'
      }
    });
    console.log('Proxy fetch successful');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Proxy error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: url,
    });
    res.status(error.response?.status || 500).json({
      message: error.message,
      data: error.response?.data,
      url: url,
    });
  }
});

app.get('/', (req, res) => {
  console.log('Received request for /');
  res.status(200).json({ message: 'Proxy server is running' });
});

// Catch-all route for debugging
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});