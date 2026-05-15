const axios = require("axios");

const BINANCE_BASE_URL = "https://data-api.binance.vision";

const ALLOWED_INTERVALS = [
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "8h",
  "12h",
  "1d",
  "3d",
  "1w",
  "1M",
];

/**
 * Get all 24hr tickers, filtered to USDT pairs only
 */
async function getAllTickers() {
  try {
    const response = await axios.get(`${BINANCE_BASE_URL}/api/v3/ticker/24hr`);

    const usdtTickers = response.data.filter((ticker) =>
      ticker.symbol.endsWith("USDT")
    );

    return usdtTickers.map((ticker) => ({
      symbol: ticker.symbol,
      lastPrice: parseFloat(ticker.lastPrice),
      priceChange: parseFloat(ticker.priceChange),
      priceChangePercent: parseFloat(ticker.priceChangePercent),
      highPrice: parseFloat(ticker.highPrice),
      lowPrice: parseFloat(ticker.lowPrice),
      volume: parseFloat(ticker.volume),
      quoteVolume: parseFloat(ticker.quoteVolume),
      weightedAvgPrice: parseFloat(ticker.weightedAvgPrice),
      count: ticker.count,
      openTime: ticker.openTime,
      closeTime: ticker.closeTime,
    }));
  } catch (error) {
    throw new Error(
      `Failed to fetch tickers from Binance: ${error.message}`
    );
  }
}

/**
 * Get single ticker by symbol
 */
async function getTickerBySymbol(symbol) {
  try {
    const response = await axios.get(
      `${BINANCE_BASE_URL}/api/v3/ticker/24hr`,
      {
        params: { symbol: symbol.toUpperCase() },
      }
    );

    const ticker = response.data;

    return {
      symbol: ticker.symbol,
      lastPrice: parseFloat(ticker.lastPrice),
      priceChange: parseFloat(ticker.priceChange),
      priceChangePercent: parseFloat(ticker.priceChangePercent),
      highPrice: parseFloat(ticker.highPrice),
      lowPrice: parseFloat(ticker.lowPrice),
      volume: parseFloat(ticker.volume),
      quoteVolume: parseFloat(ticker.quoteVolume),
      weightedAvgPrice: parseFloat(ticker.weightedAvgPrice),
      count: ticker.count,
      openTime: ticker.openTime,
      closeTime: ticker.closeTime,
    };
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(`Invalid symbol: ${symbol}`);
    }
    throw new Error(
      `Failed to fetch ticker from Binance: ${error.message}`
    );
  }
}

/**
 * Get kline/candlestick data for a symbol
 */
async function getKlines(symbol, interval = "1d", limit = 100) {
  if (!ALLOWED_INTERVALS.includes(interval)) {
    throw new Error(
      `Invalid interval. Allowed values: ${ALLOWED_INTERVALS.join(", ")}`
    );
  }

  try {
    const response = await axios.get(
      `${BINANCE_BASE_URL}/api/v3/klines`,
      {
        params: {
          symbol: symbol.toUpperCase(),
          interval,
          limit: Math.min(limit, 1000),
        },
      }
    );

    return response.data.map((k) => ({
      openTime: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
      closeTime: k[6],
      quoteVolume: parseFloat(k[7]),
      tradeCount: k[8],
    }));
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(`Invalid symbol or parameters: ${symbol}`);
    }
    throw new Error(
      `Failed to fetch klines from Binance: ${error.message}`
    );
  }
}

module.exports = {
  getAllTickers,
  getTickerBySymbol,
  getKlines,
};
