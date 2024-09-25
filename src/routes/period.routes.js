const express = require("express");
const router = express.Router();

const periodControllers = require('../controllers/period.controller');
const protectRoute = require("../middleware/protectRoute");

router.post("/", protectRoute, periodControllers.createPeriod);
router.get("/", protectRoute, periodControllers.getPeriods);
router.put("/:id", protectRoute, periodControllers.updatePeriod);

module.exports = router;
