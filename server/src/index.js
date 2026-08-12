require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initScheduler } = require('./cron/scheduler');
const adapterManager = require('./adapters/AdapterManager');

const jobRoutes = require('./routes/jobRoutes');
const examRoutes = require('./routes/examRoutes');
const savedRoutes = require('./routes/savedRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/stats', statsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start Server & Background Cron
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 FreshJobs & Exams Server running on port ${PORT}`);
  console.log(`=======================================================`);
  
  initScheduler();

  // Perform initial job sync on startup in non-production or if triggered
  setTimeout(async () => {
    try {
      console.log('[Server Startup] Running initial adapter sync...');
      await adapterManager.syncAll();
    } catch (e) {
      console.warn('[Server Startup] Initial sync skipped or deferred:', e.message);
    }
  }, 2000);
});
