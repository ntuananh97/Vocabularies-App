const cron = require("cron");
const process = require("process"); // Add this line to import the 'process' module
const https = require("https");

const URL = process.env.DOMAIN_PRODUCT_BACKEND;

const runHealthCheck = async () => {
  const url = `${URL}/api/health-check`
  console.log("Run health check: ", url);
  https
  .get(url, (res) => {
    if (res.statusCode === 200) {
      console.log("GET request sent successfully");
    } else {
      console.log("GET request failed", res.statusCode);
    }
  })
  .on("error", (e) => {
    console.error("Error while sending request", e);
  });
  };

const job = new cron.CronJob("*/14 * * * *", function () {
  runHealthCheck();
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