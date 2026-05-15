const express = require("express");
const router = express.Router();
const { searchCity, getWeather } = require("../controllers/weatherController");
const protect = require("../middleware/protect");

router.use(protect);

router.get("/search", searchCity);
router.get("/", getWeather);

module.exports = router;
