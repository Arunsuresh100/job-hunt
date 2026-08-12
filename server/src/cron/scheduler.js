const cron = require('node-cron');
const adapterManager = require('../adapters/AdapterManager');

/**
 * Initialize background cron job for auto-syncing job feeds and 7-day archiving.
 * Runs every 30 minutes.
 */
function initScheduler() {
  console.log('[Scheduler] Initializing automated job sync cron job (Every 30 minutes)...');

  cron.schedule('*/30 * * * *', async () => {
    console.log('[Scheduler] 30-Min Cron Triggered: Fetching latest jobs & auto-archiving postings > 7 days...');
    try {
      const result = await adapterManager.syncAll();
      console.log('[Scheduler] Cron execution finished successfully:', result);
    } catch (err) {
      console.error('[Scheduler] Cron execution failed:', err);
    }
  });
}

module.exports = { initScheduler };
