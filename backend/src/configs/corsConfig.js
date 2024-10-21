require('dotenv').config();
const process = require("process"); // Add this line to import the 'process' module

// Get the allowed origins from .env and split them into an array
// const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [];

const corsOptions = {
    // origin: (origin, callback) => {
    //     // Allow requests with no origin (like mobile apps or curl requests)
    //     if (!origin) return callback(null, true);
    
    //     // Check if the origin is in the list of allowed origins
    //     if (allowedOrigins.indexOf(origin) !== -1) {
    //       callback(null, true);
    //     } else {
    //       callback(new Error('Not allowed by CORS: ' + origin));
    //     }
    //   },
    origin: process.env.FRONTEND_URL,
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

module.exports = corsOptions;