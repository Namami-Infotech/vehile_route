// const { planRoute } = require("../routes/routePlanner");

// async function createRoutePlan(
//   source,
//   warehouses,
//   maxDistanceKm,
//   useGoogleDistance,
// ) {
//   return planRoute(source, warehouses, maxDistanceKm, useGoogleDistance);
// }

// module.exports = {
//   createRoutePlan,
// };
const axios = require("axios");
const { Warehouse } = require("../../../core/models");

class RouteService {
  /**
   * Generates all permutations (N!) of warehouse routes
   */
  generatePermutations(arr) {
    if (arr.length === 0) return [[]];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
      const remainingPerms = this.generatePermutations(remaining);
      for (let perm of remainingPerms) {
        result.push([current, ...perm]);
      }
    }
    return result;
  }

  async calculateOptimalRoute() {
    // 1. Source House Definition
    const source = {
      id: 0,
      name: "Source House",
      latitude: 28.519015,
      longitude: 77.2833364,
      isSource: true,
    };

    // 2. Fetch Warehouses from Database
    const warehouses = await Warehouse.findAll();

    if (!warehouses || warehouses.length === 0) {
      throw new Error("No warehouses found in database.");
    }

    const allLocations = [source, ...warehouses];
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // 3. Build Pairwise Distance Matrix via Google API
    const originsStr = allLocations
      .map((loc) => `${loc.latitude},${loc.longitude}`)
      .join("|");

    const matrixRes = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originsStr}&destinations=${originsStr}&key=${apiKey}`,
    );

    if (matrixRes.data.status !== "OK") {
      throw new Error(`Google Matrix API Error: ${matrixRes.data.status}`);
    }

    const rows = matrixRes.data.rows;

    // 4. Generate ALL possible ordering permutations of Warehouses
    const warehouseIndices = warehouses.map((_, idx) => idx + 1); // Indices 1 to N (0 is Source)
    const allCombinations = this.generatePermutations(warehouseIndices);

    const evaluatedRoutes = [];
    const maxDistanceMeters = 100 * 1000; // 100 KM Limit

    // 5. Evaluate Every Single Combination
    allCombinations.forEach((perm, index) => {
      let currentLocIdx = 0; // Start at Source (Index 0)
      let totalDistMeters = 0;
      let validSequence = [source];
      let limitExceeded = false;

      for (let targetIdx of perm) {
        const legDistance =
          rows[currentLocIdx].elements[targetIdx].distance.value;

        if (totalDistMeters + legDistance > maxDistanceMeters) {
          limitExceeded = true;
          break; // Stop adding warehouses if 100 KM limit exceeded
        }

        totalDistMeters += legDistance;
        validSequence.push(allLocations[targetIdx]);
        currentLocIdx = targetIdx;
      }

      evaluatedRoutes.push({
        combinationId: index + 1,
        pathNames: validSequence
          .map((loc) => loc.name || `Warehouse ${loc.id}`)
          .join(" ➔ "),
        warehousesCovered: validSequence.length - 1,
        totalDistanceKm: parseFloat((totalDistMeters / 1000).toFixed(2)),
        isWithin100Km:
          !limitExceeded || validSequence.length - 1 === warehouses.length,
        fullSequence: validSequence,
      });
    });

    // 6. Sort All Combinations:
    // Priority 1: Most Warehouses Covered
    // Priority 2: Lowest Distance (Shortest Path First)
    evaluatedRoutes.sort((a, b) => {
      if (b.warehousesCovered !== a.warehousesCovered) {
        return b.warehousesCovered - a.warehousesCovered; // Max warehouses first
      }
      return a.totalDistanceKm - b.totalDistanceKm; // Shortest distance first
    });

    // Best Route is Rank 1
    const winningRoute = evaluatedRoutes[0];

    return {
      success: true,
      totalPossibleCombinationsEvaluated: evaluatedRoutes.length,
      proofSummary: {
        winningShortestDistanceKm: winningRoute.totalDistanceKm,
        maxWarehousesCovered: winningRoute.warehousesCovered,
        totalWarehousesAvailable: warehouses.length,
        winningSequence: winningRoute.pathNames,
      },
      // Winning Route Data for Frontend Maps
      source: source,
      totalDistanceKm: winningRoute.totalDistanceKm,
      warehousesCoveredCount: winningRoute.warehousesCovered,
      routeSequence: winningRoute.fullSequence,

      // Complete Mathematical Proof Table for Client Verification
      allCombinationsRanked: evaluatedRoutes.map((route, rank) => ({
        rank: rank + 1,
        pathOrder: route.pathNames,
        warehousesCovered: route.warehousesCovered,
        totalDistanceKm: `${route.totalDistanceKm} KM`,
        status:
          rank === 0
            ? "🏆 BEST OPTIMAL SHORTEST PATH"
            : "Sub-optimal / Longer Path",
      })),
    };
  }
}

module.exports = new RouteService();
