const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = process.env.VITE_API_KEY;
const BASE_URL = 'http://www.omdbapi.com/';

app.get('/api/proxy', async (req, res) => {
  const { s, i } = req.query;

  console.log('Proxy Environment:', { API_KEY, BASE_URL });

  if (!API_KEY) {
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
  res.status(200).json({ message: 'Proxy server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});