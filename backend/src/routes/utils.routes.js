const express = require("express");
const router = express.Router();

// The route is only for cron job to avoid the railway server sleep
router.get("/health-check", (req, res) => {
    res.send("I'm super healthy! You don't need to worry about me.");
});

module.exports = router;
