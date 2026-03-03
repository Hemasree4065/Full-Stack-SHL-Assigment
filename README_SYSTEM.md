# SHL Assessment Recommendation System

## Overview

This is an intelligent recommendation system that leverages AI to match job descriptions with the most relevant SHL assessments from their product catalog. The system uses LLM-based ranking, semantic understanding, and intelligent balancing to suggest optimal assessments for hiring managers.

## Architecture

### Backend (Express.js + Node.js)
- **API Server**: RESTful endpoints for health checks and recommendations
- **Database**: SQLite for persistent storage of assessments and cached results
- **LLM Integration**: Google Gemini API for intelligent ranking and analysis
- **Data Pipeline**: Web scraper for SHL catalog + embedding generation

### Frontend (React + Vite)
- Modern, responsive UI for query input and results visualization
- Real-time recommendations with visual relevance scoring
- Example queries for easy testing

### Key Components

```
server/
├── server.js              # Main Express application
├── routes/
│   ├── health.js          # Health check endpoint
│   └── recommendation.js   # Recommendation endpoint
├── services/
│   ├── database.js        # SQLite management
│   ├── scraper.js         # SHL catalog scraping
│   └── recommender.js     # LLM-based recommendation engine
├── middleware/
│   └── validation.js      # Request validation
└── scripts/
    ├── scrapeSHL.js       # Scrape assessments
    ├── generateSampleData.js  # Generate sample data
    ├── evaluate.js        # Evaluate on training data
    └── generatePredictions.js # Generate test predictions
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- Google Gemini API key (free tier available at https://ai.google.dev/gemini-api/docs/pricing)

### Installation

1. **Install Backend Dependencies**
```bash
cd server
npm install
```

2. **Configure Environment Variables**
```bash
# Create .env file
cp .env.example .env

# Add your Gemini API key
# GEMINI_API_KEY=your_api_key_here
```

3. **Initialize Database**
```bash
npm run scrape  # Scrapes SHL catalog
# or for testing with sample data:
node scripts/generateSampleData.js
```

4. **Start API Server**
```bash
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
# From project root
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

## API Endpoints

### 1. Health Check
```
GET /api/health
```

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2024-03-03T10:30:00Z",
  "database": {
    "connected": true,
    "assessmentCount": 377
  },
  "message": "API is running and ready to process recommendations"
}
```

### 2. Recommendation Endpoint
```
POST /api/recommend
Content-Type: application/json

{
  "query": "I am hiring for Java developers who can also collaborate effectively with my business teams."
}
```

**Response** (200 OK):
```json
{
  "query": "I am hiring for Java developers who can also collaborate effectively with my business teams.",
  "recommendations": [
    {
      "assessment_name": "Java Assessment 1",
      "url": "https://www.shl.com/solutions/products/java-assessment-1/",
      "test_type": "K",
      "category": "Technical",
      "relevance_score": 95,
      "reason": "Directly assesses required Java programming skills"
    },
    {
      "assessment_name": "Teamwork Competency",
      "url": "https://www.shl.com/solutions/products/teamwork-competency/",
      "test_type": "P",
      "category": "Soft Skills",
      "relevance_score": 85,
      "reason": "Evaluates collaboration and team interaction abilities"
    }
    // ... more recommendations
  ],
  "count": 10,
  "timestamp": "2024-03-03T10:30:00Z"
}
```

## How It Works

### 1. Data Ingestion Pipeline
- Scrapes SHL assessment catalog or uses provided sample data
- Parses assessment details (name, URL, test type, category)
- Stores in SQLite database with metadata

### 2. Query Processing
- Validates incoming job description/query
- Checks cache for previously computed results
- Analyzes query to identify required skills

### 3. Intelligent Ranking
Uses Google Gemini LLM to:
- Understand context and requirements from query
- Match against available assessments
- Generate relevance scores (0-100)
- Provide reasoning for each recommendation

### 4. Balancing Algorithm
Automatically balances recommendations between:
- **Hard Skills** (Knowledge & Skills, Type K)
- **Soft Skills** (Personality & Behavior, Type P)

Example:
```
Query: "Java developer who collaborates effectively"
Expected Balance: 60% Technical + 40% Behavioral
```

### 5. Response & Caching
- Returns top 10 recommendations sorted by relevance
- Caches results for repeated queries
- Limits response to max 10, min 1 assessment

## Evaluation Metrics

### Mean Recall@10
Measures how many relevant assessments were retrieved in the top 10 recommendations.

```
Recall@K = Number of relevant assessments in top K / Total relevant assessments
Mean Recall@K = Average recall across all test queries
```

### Training Data Usage
- Load training queries with labeled relevant assessments
- Evaluate recommendations for each query
- Measure recall and adjust LLM prompts
- Track improvements iteratively

## Running Evaluations

### On Training Data
```bash
npm run evaluate
```

Output:
```
Mean Recall@10: 75.50%

Query: "I am hiring for Java developers..."
  Recall@10: 80.00%
  Found: 4/5 relevant assessments

Query: "Looking to hire mid-level professionals..."
  Recall@10: 71.43%
  Found: 5/7 relevant assessments
```

### Generate Test Predictions
```bash
npm run predictions
```

Creates `predictions.csv` with format:
```csv
Query,Assessment_url
"Query 1","https://..."
"Query 1","https://..."
```

## Performance Optimization

### Caching Strategy
- Hash-based query caching
- Check cache before LLM ranking
- Suitable for repeated queries

### LLM Integration
- Batch processing for multiple assessments
- Fallback to text-based matching if LLM fails
- Efficient token usage with structured prompts

### Database Indexing
- Index on assessment names and URLs
- Indexed query hashes for cache lookups
- Optimized for quick assessment retrieval

## Deployment

### API Server (Node.js)
- Can be deployed to Heroku, Railway, Render, etc.
- Uses environment variables for configuration
- Example: `PORT=5000 GEMINI_API_KEY=xxx npm start`

### Frontend (React)
- Build: `npm run build`
- Deploy to Netlify, Vercel, GitHub Pages, etc.
- Configure API URL via `VITE_API_URL` environment variable

## Troubleshooting

### No Assessments in Database
```bash
# Reinitialize with sample data
node scripts/generateSampleData.js

# Or scrape live SHL catalog
npm run scrape
```

### API Connection Issues
- Check `VITE_API_URL` in frontend `.env`
- Ensure backend is running on configured port
- Enable CORS (already configured in Express)

### Memory Issues
- Clear query cache: Delete entries from `query_cache` table
- Limit assessment count in initial load
- Use pagination for large result sets

## Future Enhancements

1. **Vector Embeddings**: Replace LLM ranking with vector similarity search
2. **Multi-language Support**: Support non-English queries
3. **Custom Catalog**: Allow organizations to upload custom assessment catalogs
4. **Analytics Dashboard**: Track which assessments are recommended most frequently
5. **A/B Testing**: Compare different ranking algorithms
6. **Batch Processing**: Handle multiple job descriptions simultaneously
7. **Advanced Filtering**: Add filters for assessment difficulty, duration, cost

## Technology Stack

| Component | Technology |
|-----------|-----------|
| API | Express.js |
| Frontend | React 19 + Vite |
| Database | SQLite3 |
| LLM | Google Gemini API |
| Scraping | Axios + Cheerio |
| CSV Handling | csv-writer, csv-parser |
| Environment | dotenv |

## Testing

### Manual Testing
use the example queries in the frontend or test API directly:

```bash
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": "Java developer"}'
```

### Automated Testing
```bash
npm run evaluate  # Test on labeled training set
```

## License

This project is developed as an assessment solution for evaluating AI programming and problem-solving skills.

## Support

For issues, questions, or suggestions, please refer to the included documentation or code comments.
