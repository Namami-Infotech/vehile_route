const axios = require("axios");

async function getDistanceMatrix(origin, destinations) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }

  const params = {
    origins: `${origin.lat},${origin.lng}`,
    destinations: destinations.map((d) => `${d.lat},${d.lng}`).join("|"),
    key: apiKey,
    units: "metric",
  };

  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/distancematrix/json",
    {
      params,
    },
  );

  if (response.data.status !== "OK") {
    throw new Error(
      `Google Distance Matrix API error: ${response.data.error_message || response.data.status}`,
    );
  }

  return response.data.rows[0].elements.map((element, index) => {
    return {
      warehouse: destinations[index],
      distanceKm:
        element.status === "OK"
          ? element.distance.value / 1000
          : Number.POSITIVE_INFINITY,
      durationSeconds: element.status === "OK" ? element.duration.value : null,
    };
  });
}

module.exports = {
  getDistanceMatrix,
};
