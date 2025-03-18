# URL Content Q&A Tool

A web-based tool that allows users to extract content from web pages and ask questions about that content. The application uses the Firecrawl API for web scraping and the Gemini API for answering questions.

## Features

- Input multiple URLs to extract content
- Ask questions about the extracted content
- View concise answers generated based only on the extracted information
- Preview the extracted content

## How It Works

1. The application crawls the provided URLs using the Firecrawl API
2. The extracted content is stored in memory
3. When a user asks a question, the application uses the Gemini API to generate an answer based solely on the extracted content
4. The answer is displayed to the user

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firecrawl API key
- Gemini API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/url-content-qa-tool.git
   cd url-content-qa-tool
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory based on the `.env.example` file:
   ```
   cp .env.example .env
   ```

4. Add your API keys to the `.env` file:
   ```
   FIRECRAWL_KEY=your_firecrawl_api_key_here
   GEMINI_KEY=your_gemini_api_key_here
   ```

### Running the Application

1. Start the server:
   ```
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. Enter a URL in the input field and click "Add URL"
2. Add as many URLs as you want to analyze
3. Click "Fetch Content" to extract information from all URLs
4. Once the content is fetched, you can:
   - View a preview of the extracted content by clicking "Show Preview"
   - Ask questions in the input field and click "Ask" to get answers based on the content

## Project Structure

```
/url-content-qa-tool
│
├── server.js            # Main server file
├── package.json         # Project dependencies
├── .env                 # Environment variables (not committed to git)
├── .env.example         # Example environment variable file
├── public/              # Public assets
│   └── index.html       # Main HTML file
│
└── README.md            # This file
```

## Technology Stack

- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript
- **Backend**: Node.js, Express
- **APIs**: Firecrawl (web scraping), Gemini (question answering)

## License

MIT