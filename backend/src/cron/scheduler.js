const cron = require('node-cron');
const IngestionService = require('../services/ingestion.service');
const fetchAndStoreNews = require('../utils/newsFetcher');

const init = () => {
    // 1. NIRF Check (Monthly - 1st of every month at 2 AM)
    cron.schedule('0 2 1 * *', async () => {
        console.log('[CRON] Checking for NIRF Rankings...');
        const year = new Date().getFullYear();
        // Strategy: Try to fetch known URL patterns or just log reminders
        // Since we can't scrape, we rely on Admin or specific known URLs.
        // We will "Detect" by attempting a HEAD request to predicted URLs?
        // For now, we just Log the reminder as per "HYBRID" model where detection is automated 
        // but if URL changes, Admin might need to intervene via the Trigger API.
        console.log(`[CRON] NIRF Auto-Check for ${year} - If failed, Admin must upload.`);
        // Attempt ingestion for Engineering (Predictable URL often used)
        // const url = `https://www.nirfindia.org/${year}/Engineering.pdf`;
        // IngestionService.triggerNirfIngestion(url, year, 'Engineering').catch(e => console.log('NIRF Auto-Check failed (Expected if not released):', e.message));
    });

    // 2. JoSAA Check (Weekly in May-August?)
    cron.schedule('0 0 * 5-8 *', () => {
        console.log('[CRON] Checking for JoSAA Seat Matrix...');
        // Similar predictable URL check logic
    });

    // 3. News Ingestion (Every 2 hours for fresh content)
    cron.schedule('0 */2 * * *', async () => {
        console.log('[CRON] Starting News Ingestion...');
        try {
            await fetchAndStoreNews();
        } catch (error) {
            console.error('[CRON] News fetch error:', error.message);
        }
    });

    // 4. Initial news fetch on startup (delayed by 30 seconds to allow DB connection)
    setTimeout(async () => {
        console.log('[STARTUP] Initial News Fetch...');
        try {
            await fetchAndStoreNews();
        } catch (error) {
            console.error('[STARTUP] Initial news fetch error:', error.message);
        }
    }, 30000);

    console.log('✅ Ingestion Scheduler Initialized (NIRF, JoSAA, News every 2hrs)');
};

module.exports = { init };

