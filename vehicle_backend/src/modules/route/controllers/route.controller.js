// const routeService = require("../services/route.service");

// async function planRoute(req, res, next) {
//   try {
//     const { source, maxDistanceKm = 100, useGoogleDistance = false } = req.body;

//     if (!source || source.lat == null || source.lng == null) {
//       return res
//         .status(400)
//         .json({ error: "source.lat and source.lng are required" });
//     }

//     const plan = await routeService.createRoutePlan(
//       source,
//       req.warehouses,
//       Number(maxDistanceKm),
//       useGoogleDistance,
//     );
//     res.json(plan);
//   } catch (error) {
//     next(error);
//   }
// }

// module.exports = {
//   planRoute,
// };
const routeService = require("../services/route.service");

exports.getShortestPath = async (req, res) => {
  try {
    const result = await routeService.calculateOptimalRoute();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate route",
    });
  }
};
