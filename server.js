// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Firecrawl API endpoint
const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1/scrape';
const FIRECRAWL_KEY = process.env.FIRECRAWL_API_KEY;

// Gemini API endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
const GEMINI_KEY = process.env.GEMINI_KEY;

// Endpoint to fetch content from URLs
app.post('/api/fetch-content', async (req, res) => {
  try {
    const { urls } = req.body;
    console.log("urls",urls);
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'Please provide a valid array of URLs' });
    }
    
    // Call Firecrawl API for each URL
    const contentPromises = urls.map(async (url) => {
      const response = await axios.post(
        FIRECRAWL_API_URL,
        { url : url,
          formats: ['markdown'], // Specify the desired format
          onlyMainContent: true //extract only the main content.
         },
        { headers: { 'Authorization': `Bearer ${FIRECRAWL_KEY}` } }
      );
      console.log("*******",response.data);

      let extractedContent = '';
      if (response.data && response.data.content) {
        extractedContent = response.data.content;
      } else if (response.data && response.data.text) {
        extractedContent = response.data.text;
      } else if (response.data && typeof response.data === 'object') {
        // Convert object to string representation if it's an object
        extractedContent = JSON.stringify(response.data);
      }

      return {
        url,
        content: extractedContent || 'No content extracted'
      };
    });
    
    const contentResults = await Promise.all(contentPromises);
    
    // Combine all extracted content
    const combinedContent = contentResults.map(item => 
      `Content from ${item.url}:\n${item.content}`
    ).join('\n\n');
    
    return res.json({ success: true, content: combinedContent });
  } catch (error) {
    console.error('Error fetching content:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch content', 
      message: error.message 
    });
  }
});

// Endpoint to ask questions about the content
app.post('/api/ask-question', async (req, res) => {
  try {
    const { question, content } = req.body;
    
    if (!question || !content) {
      return res.status(400).json({ error: 'Please provide both question and content' });
    }
    
    // Call Gemini API to answer the question
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Answer the following question using ONLY the information from the provided content. If the information is not available in the content, say "I don't have information about that in the provided content."
            
            CONTENT:
            ${content}
            
            QUESTION: ${question}`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800
        }
      }
    );
    
    const answer = response.data.candidates[0].content.parts[0].text;
    return res.json({ success: true, answer });
  } catch (error) {
    console.error('Error asking question:', error);
    return res.status(500).json({ 
      error: 'Failed to get answer', 
      message: error.message 
    });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});