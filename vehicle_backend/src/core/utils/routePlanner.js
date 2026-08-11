const { haversineDistanceKm } = require("./geo");
const { getDistanceMatrix } = require("./googleMaps");

function findNearestWarehouse(
  currentLocation,
  warehouses,
  visited,
  maxDistanceKm,
  usedDistanceKm,
) {
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const warehouse of warehouses) {
    if (visited.has(warehouse.id)) continue;

    const distance = haversineDistanceKm(currentLocation, {
      lat: warehouse.lat,
      lng: warehouse.lng,
    });
    const nextDistance = usedDistanceKm + distance;
    if (nextDistance <= maxDistanceKm && distance < bestDistance) {
      bestDistance = distance;
      best = {
        warehouse,
        distanceKm: Number(distance.toFixed(3)),
      };
    }
  }

  return best;
}

async function planRoute(source, warehouses, maxDistanceKm, useGoogleDistance) {
  const available = [...warehouses];
  const visited = new Set();
  const stops = [];
  let currentLocation = source;
  let usedDistanceKm = 0;

  if (
    useGoogleDistance &&
    process.env.GOOGLE_MAPS_API_KEY &&
    available.length
  ) {
    const matrixRows = await getDistanceMatrix(currentLocation, available);
    matrixRows.sort((a, b) => a.distanceKm - b.distanceKm);
    for (const row of matrixRows) {
      if (visited.has(row.warehouse.id)) continue;
      if (usedDistanceKm + row.distanceKm > maxDistanceKm) break;
      visited.add(row.warehouse.id);
      stops.push({
        warehouse: row.warehouse,
        distanceKm: Number(row.distanceKm.toFixed(3)),
        durationSeconds: row.durationSeconds,
      });
      usedDistanceKm += row.distanceKm;
      currentLocation = { lat: row.warehouse.lat, lng: row.warehouse.lng };
    }
  } else {
    while (true) {
      const next = findNearestWarehouse(
        currentLocation,
        available,
        visited,
        maxDistanceKm,
        usedDistanceKm,
      );
      if (!next) break;
      visited.add(next.warehouse.id);
      stops.push({
        warehouse: next.warehouse,
        distanceKm: next.distanceKm,
      });
      usedDistanceKm += next.distanceKm;
      currentLocation = { lat: next.warehouse.lat, lng: next.warehouse.lng };
    }
  }

  return {
    source,
    maxDistanceKm,
    usedDistanceKm: Number(usedDistanceKm.toFixed(3)),
    remainingDistanceKm: Number(
      Math.max(maxDistanceKm - usedDistanceKm, 0).toFixed(3),
    ),
    stops,
  };
}

module.exports = {
  planRoute,
};
