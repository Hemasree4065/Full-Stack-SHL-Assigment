import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import recommendationRouter from './routes/recommendation.js';
import healthRouter from './routes/health.js';
import { initializeDatabase } from './services/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
let dbInitialized = false;

const initializeApp = async () => {
  try {
    await initializeDatabase();
    dbInitialized = true;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization warning:', error.message);
    console.log('API may still function with in-memory operations');
  }
};

// Routes
app.use('/api/health', healthRouter);
app.use('/api/recommend', recommendationRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'SHL Assessment Recommendation API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      recommend: '/api/recommend'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
initializeApp().then(() => {
  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log('SHL Recommendation API Server');
    console.log(`${'='.repeat(60)}`);
    console.log(`Running on: http://localhost:${PORT}`);
    console.log(`Health Check: GET http://localhost:${PORT}/api/health`);
    console.log(`Recommend: POST http://localhost:${PORT}/api/recommend`);
    console.log(`Database Status: ${dbInitialized ? 'Initialized' : 'Warning'}`);
    console.log(`${'='.repeat(60)}\n`);
  });
}).catch(error => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});

export default app;
