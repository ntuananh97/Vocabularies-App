const cron = require("cron");
const process = require("process"); // Add this line to import the 'process' module
const axios = require('axios');


const URL = process.env.DOINMAIN_PRODUCT_BACKEND;

const sendPostRequest = async () => {
    try {
        console.log('Running cron job: Sending POST request...');
        
        // Gọi POST request tới API mong muốn
        await axios.post(`${URL}/api/post-job`, {});
      } catch (error) {
        console.error('Error in cron request request:', error.message);
      }
  };

const job = new cron.CronJob("*/14 * * * *", function () {
	sendPostRequest()
});

module.exports = job;

// CRON JOB EXPLANATION:
// Cron jobs are scheduled tasks that run periodically at fixed intervals or specific times
// send 1 GET request for every 14 minutes

// Schedule:
// You define a schedule using a cron expression, which consists of five fields representing:

//! MINUTE, HOUR, DAY OF THE MONTH, MONTH, DAY OF THE WEEK

//? EXAMPLES && EXPLANATION:
//* 14 * * * * - Every 14 minutes
//* 0 0 * * 0 - At midnight on every Sunday
//* 30 3 15 * * - At 3:30 AM, on the 15th of every month
//* 0 0 1 1 * - At midnight, on January 1st
//* 0 * * * * - Every hour