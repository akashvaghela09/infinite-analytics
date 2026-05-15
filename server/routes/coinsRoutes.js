const express = require("express");
const router = express.Router();
const { getAll, getOne, getKlines } = require("../controllers/coinsController");
const protect = require("../middleware/protect");

router.use(protect);

router.get("/", getAll);
router.get("/:symbol", getOne);
router.get("/:symbol/klines", getKlines);

module.exports = router;
