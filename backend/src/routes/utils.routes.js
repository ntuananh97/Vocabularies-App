const express = require("express");
const router = express.Router();

// The route is only for cron job to avoid the railway server sleep
router.post("/post-job", (req, res) => {
    res.send("Upload Single File");
});

module.exports = router;
