const binanceService = require("../services/binanceService");

const VALID_SORT_FIELDS = [
  "symbol",
  "lastPrice",
  "priceChange",
  "priceChangePercent",
  "highPrice",
  "lowPrice",
  "volume",
  "quoteVolume",
];

/**
 * Get all USDT tickers with pagination, sorting, and search
 * GET /api/coins?page=1&limit=50&sortBy=quoteVolume&sortOrder=desc&search=BTC
 */
exports.getAll = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const sortBy = VALID_SORT_FIELDS.includes(req.query.sortBy)
      ? req.query.sortBy
      : "quoteVolume";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
    const search = (req.query.search || "").trim().toUpperCase();

    let tickers = await binanceService.getAllTickers();

    // Server-side search filter
    if (search) {
      tickers = tickers.filter((t) => t.symbol.includes(search));
    }

    tickers.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    // Pagination
    const totalCoins = tickers.length;
    const totalPages = Math.ceil(totalCoins / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = tickers.slice(startIndex, startIndex + limit);

    res.json({
      success: true,
      page,
      limit,
      totalCoins,
      totalPages,
      data: paginatedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get single coin ticker
 * GET /api/coins/:symbol
 */
exports.getOne = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Symbol is required",
      });
    }

    const ticker = await binanceService.getTickerBySymbol(symbol);
    res.json({
      success: true,
      data: ticker,
    });
  } catch (error) {
    if (error.message.includes("Invalid symbol")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get klines/candlestick data
 * GET /api/coins/:symbol/klines
 */
exports.getKlines = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = "1d", limit = 100 } = req.query;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: "Symbol is required",
      });
    }

    const klines = await binanceService.getKlines(
      symbol,
      interval,
      parseInt(limit, 10)
    );

    res.json({
      success: true,
      data: klines,
    });
  } catch (error) {
    if (error.message.includes("Invalid interval")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes("Invalid symbol")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
