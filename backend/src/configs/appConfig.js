const process = require("process"); // Add this line to import the 'process' module


const DOMAIN = {
    PRODUCTION: '.myanki.xyz',
    DEVELOPMENT: process.env.FRONTEND_URL,
}



module.exports = {
    DOMAIN
};