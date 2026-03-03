# Quick Start Guide - SHL Assessment Recommendation System

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies (from root)
cd ..
npm install
```

### Step 2: Configure API Key

```bash
# Go to server directory
cd server

# Copy the example environment file
cp .env.example .env

# Add your Gemini API key
# Edit .env and set:
# GEMINI_API_KEY=your_key_here
```

Get a free Gemini API key: https://ai.google.dev/gemini-api/docs/pricing

### Step 3: Initialize Database

```bash
# From server directory
npm run generate-data  # Creates sample 400+ assessments
# or
npm run scrape        # Scrapes live SHL catalog
```

### Step 4: Start Both Servers

**Terminal 1 - API Server**:
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
npm run dev
# Frontend available on http://localhost:5173
```

### Step 5: Test the System

Open http://localhost:5173 in your browser and try:
- Enter: "Java developer with team collaboration skills"
- Click "Get Recommendations"
- See top 10 relevant assessments!

## Available Commands

### Backend (from `server/` directory)

```bash
npm start                 # Start API server
npm run dev             # Start with auto-reload
npm run scrape          # Scrape SHL catalog
npm run generate-data   # Create sample assessments
npm run evaluate        # Test on training data
npm run predictions     # Generate test set predictions
```

### Frontend (from root directory)

```bash
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

## Project Structure

```
.
├── server/                          # Backend API
│   ├── server.js                    # Express app entry
│   ├── package.json                 # Backend dependencies
│   ├── .env.example                 # Environment template
│   ├── routes/
│   │   ├── health.js                # Health check endpoint
│   │   └── recommendation.js        # Main recommendation endpoint
│   ├── services/
│   │   ├── database.js              # SQLite management
│   │   ├── scraper.js               # Web scraping
│   │   └── recommender.js           # LLM ranking engine
│   ├── middleware/
│   │   └── validation.js            # Input validation
│   ├── scripts/
│   │   ├── scrapeSHL.js             # Scrape assessments
│   │   ├── generateSampleData.js    # Create sample data
│   │   ├── evaluate.js              # Evaluate system
│   │   └── generatePredictions.js   # Test predictions
│   └── data/
│       ├── assessments.db           # SQLite database
│       ├── train_data.csv           # Training set
│       └── test_queries.csv         # Test set
├── src/                             # Frontend React
│   ├── App.jsx                      # Main component
│   ├── App.css                      # Main styles
│   └── main.jsx                     # Entry point
├── vite.config.js                   # Vite configuration
├── package.json                     # Frontend dependencies
└── SOLUTION_APPROACH.md             # Solution documentation
```

## Environment Variables

### Backend (.env)
```bash
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```bash
# Optional (defaults to http://localhost:5000/api)
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

### "Cannot find module" errors
```bash
# Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Use different port
PORT=5001 npm start

# Or kill existing process
# On Windows: taskkill /PID <pid> /F
# On Linux/Mac: kill -9 <pid>
```

### Database file not found
```bash
# Regenerate database
cd server
npm run generate-data
```

### API connection errors
- Check that backend is running: `curl http://localhost:5000/api/health`
- Verify VITE_API_URL in frontend .env
- Check browser console for specific errors

### No Gemini API key
- Get free key at: https://ai.google.dev/gemini-api/docs/pricing
- Add to server/.env: `GEMINI_API_KEY=your_key`

## Testing the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get Recommendations
```bash
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": "Java developer with team skills"}'
```

### Evaluate on Training Data
```bash
cd server
npm run evaluate
```

## Next Steps

1. **Test with Training Data**: `npm run evaluate` (shows performance metrics)
2. **Generate Predictions**: `npm run predictions` (creates predictions.csv)
3. **Deploy**: See SOLUTION_APPROACH.md for deployment options
4. **Customize**: Modify prompts in recommender.js for better results

## Documentation Files

- **README_SYSTEM.md**: Complete system documentation
- **SOLUTION_APPROACH.md**: Technical approach & architecture
- **QUICK_START.md**: This file (quick setup guide)

## System Requirements

- **Node.js**: 18.0+
- **Memory**: 256MB minimum
- **Storage**: ~100MB (including node_modules)
- **Network**: Internet for Gemini API calls

## Performance Expectations

- First request: 3-5 seconds (LLM ranking)
- Repeated query: <100ms (from cache)
- Database: 400+ assessments
- Max recommendations: 10 per query
- API uptime: 99.5%+ (with proper hosting)

## Security Notes

- API Key stored in .env (never in code)
- CORS enabled for localhost development
- Input validation on all endpoints
- No data persistence between requests (except caching)

## Support & Debugging

### Enable verbose logging
Add to server.js:
```javascript
console.log('Debug info:', req.body);
```

### Check database
```bash
# View all assessments
sqlite3 server/data/assessments.db "SELECT COUNT(*) FROM assessments;"
```

### Monitor API calls
Open browser DevTools → Network tab → see all API calls

## Success Indicators

✓ Health check returns 200 OK
✓ Database loads with 400+ assessments
✓ Recommendations appear in <5 seconds  
✓ Results include mixed hard/soft skills
✓ Training data evaluation shows >70% recall

---

**Ready to go!** Start with Step 1 and you'll be running in 5 minutes.
