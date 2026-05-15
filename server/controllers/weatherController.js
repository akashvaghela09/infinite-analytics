const openMeteoService = require("../services/openMeteoService");

exports.searchCity = async (req, res) => {
  try {
    const name = (req.query.name || "").trim();
    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "name query param must be at least 2 characters",
      });
    }

    const results = await openMeteoService.searchCity(name);
    return res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getWeather = async (req, res) => {
  try {
    const lat = req.query.lat;
    const lng = req.query.lng;

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({
        success: false,
        message: "lat and lng query params are required and must be valid numbers",
      });
    }

    const weather = await openMeteoService.getWeather(latitude, longitude);
    return res.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
