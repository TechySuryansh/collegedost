const cron = require('node-cron');
const { autoIngestExams } = require('../controllers/exam.controller');

const initExamCron = () => {
    // Run every 12 hours (at 00:00 and 12:00)
    cron.schedule('0 0,12 * * *', async () => {
        console.log('⏳ Running Scheduled Exam News Refresh...');
        try {
            // We pass mock req/res objects since we are calling a controller function
            const mockReq = {};
            const mockRes = {
                status: (code) => ({ json: (data) => console.log(`✅ Exam Cron Result [${code}]: Ingested ${data.ingested ? data.ingested.length : 0} exams`) })
            };
            
            await autoIngestExams(mockReq, mockRes);
        } catch (error) {
            console.error('❌ Exam Cron Failed:', error.message);
        }
    });

    console.log('🕒 Exam News Auto-Update Scheduled (Every 12 Hours)');
};

module.exports = initExamCron;
