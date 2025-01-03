const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/top-performing', async (req, res) => {
  try {
    const response = await axios.get('https://yahoo-finance166.p.rapidapi.com/api/market/get-top-performing', {
      headers: {
        'X-RapidAPI-Key': process.env.YAHOO_API_KEY,
        'X-RapidAPI-Host': 'yahoo-finance166.p.rapidapi.com'
      },
      params: {
        count: 5,
        region: 'US',
        language: 'en-US',
        quoteType: 'ETFS',
        offset: 0
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching top-performing stocks:', error);
    res.status(500).json({ message: 'Failed to fetch top-performing stocks' });
  }
});

module.exports = router;

